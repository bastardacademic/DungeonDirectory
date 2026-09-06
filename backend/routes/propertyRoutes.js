const express = require('express');
const { body, validationResult } = require('express-validator');
const {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
} = require('../controllers/propertyController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

const router = express.Router();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const propertyValidation = [
    body('name').notEmpty(),
    body('description').notEmpty(),
    body('location').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('availability').isBoolean(),
];

router.use(authMiddleware);

router.post('/', requireRole('HOST'), propertyValidation, handleValidation, createProperty);
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.put('/:id', propertyValidation, handleValidation, updateProperty);
router.delete('/:id', deleteProperty);

module.exports = router;
