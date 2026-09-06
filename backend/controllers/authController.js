const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const prisma = require('../prismaClient');

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

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
