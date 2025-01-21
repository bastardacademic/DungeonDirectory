const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post(
    '/login',
    [body('email').isEmail(), body('password').isLength({ min: 6 })],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    loginUser
);

router.post(
    '/register',
    [body('email').isEmail(), body('password').isLength({ min: 6 })],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    registerUser
);

module.exports = router;
