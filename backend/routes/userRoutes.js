const express = require('express');
const router = express.Router();

// Controllers (import or define as needed)
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController');

// Routes
// POST /api/users/register - Register a new user
router.post('/register', registerUser);

// POST /api/users/login - Login a user
router.post('/login', loginUser);

// GET /api/users/profile - Get user profile (protected route)
router.get('/profile', getUserProfile);

// PUT /api/users/profile - Update user profile (protected route)
router.put('/profile', updateUserProfile);

module.exports = router;
