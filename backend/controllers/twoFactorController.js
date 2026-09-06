const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const prisma = require('../prismaClient');

const setupTotp = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const secret = speakeasy.generateSecret({
            name: `DungeonDirectory (${user.email})`,
        });

        await prisma.user.update({
            where: { id: user.id },
            data: { totpSecret: secret.base32, totpEnabled: false },
        });

        const qrCode = await qrcode.toDataURL(secret.otpauth_url);

        res.status(200).json({
            message: 'Scan this QR code with your authenticator app, then confirm with a code via /2fa/verify',
            secret: secret.base32,
            qrCode,
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const verifyTotp = async (req, res) => {
    try {
        const { totpCode } = req.body;

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user || !user.totpSecret) {
            return res.status(400).json({ message: 'No pending TOTP setup for this user' });
        }

        const totpValid = speakeasy.totp.verify({
            secret: user.totpSecret,
            encoding: 'base32',
            token: totpCode,
            window: 1,
        });

        if (!totpValid) {
            return res.status(400).json({ message: 'Invalid TOTP code' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { totpEnabled: true },
        });

        res.status(200).json({ message: '2FA enabled successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const disableTotp = async (req, res) => {
    try {
        const { password } = req.body;

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatches = await bcrypt.compare(password || '', user.password);
        if (!passwordMatches) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { totpSecret: null, totpEnabled: false },
        });

        res.status(200).json({ message: '2FA disabled successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    setupTotp,
    verifyTotp,
    disableTotp,
};
