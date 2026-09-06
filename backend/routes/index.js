'use strict';

const express = require('express');
const authRoutes = require('./authRoutes');
const propertyRoutes = require('./propertyRoutes');
const reservationRoutes = require('./reservationRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/reservations', reservationRoutes);

module.exports = router;
