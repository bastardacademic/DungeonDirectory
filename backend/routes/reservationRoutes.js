const express = require('express');
const { body, validationResult } = require('express-validator');
const {
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    deleteReservation,
} = require('../controllers/reservationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const reservationValidation = [
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('duration').isInt({ min: 1 }),
];

router.use(authMiddleware);

router.post('/', [...reservationValidation, body('propertyId').isInt()], handleValidation, createReservation);
router.get('/', getReservations);
router.get('/:id', getReservationById);
router.put('/:id', reservationValidation, handleValidation, updateReservation);
router.delete('/:id', deleteReservation);

module.exports = router;
