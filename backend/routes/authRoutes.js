const express = require('express');
const { body, validationResult } = require('express-validator');
const { loginUser, registerUser, upgradeToHost } = require('../controllers/authController');
const { setupTotp, verifyTotp, disableTotp } = require('../controllers/twoFactorController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post(
    '/register',
    [body('email').isEmail(), body('password').isLength({ min: 6 })],
    handleValidation,
    registerUser
);

router.post(
    '/login',
    [body('email').isEmail(), body('password').notEmpty()],
    handleValidation,
    loginUser
);

router.post('/2fa/setup', authMiddleware, setupTotp);
router.post('/2fa/verify', authMiddleware, [body('totpCode').notEmpty()], handleValidation, verifyTotp);
router.post('/2fa/disable', authMiddleware, [body('password').notEmpty()], handleValidation, disableTotp);

router.post('/upgrade-to-host', authMiddleware, upgradeToHost);

module.exports = router;
