const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const prisma = require('../prismaClient');

const signToken = (user) => jwt.sign({ id: user.id, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '1h' });

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        const token = signToken(newUser);

        res.status(201).json({
            message: 'User registered successfully',
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password, totpCode } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.totpEnabled) {
            if (!totpCode) {
                return res.status(401).json({ message: 'TOTP code required', totpRequired: true });
            }

            const totpValid = speakeasy.totp.verify({
                secret: user.totpSecret,
                encoding: 'base32',
                token: totpCode,
                window: 1,
            });

            if (!totpValid) {
                return res.status(401).json({ message: 'Invalid TOTP code', totpRequired: true });
            }
        }

        const token = signToken(user);

        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const upgradeToHost = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.roles.includes('HOST')) {
            return res.status(400).json({ message: 'You are already a host' });
        }

        if (!user.totpEnabled) {
            return res.status(403).json({
                message: 'Enable 2FA before becoming a host',
                requires2FA: true,
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { roles: { push: 'HOST' } },
        });

        const token = signToken(updatedUser);

        res.status(200).json({
            message: 'You are now a host',
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    upgradeToHost,
};
