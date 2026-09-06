'use strict';

const express = require('express');
const authRoutes = require('./authRoutes');
const propertyRoutes = require('./propertyRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);

module.exports = router;
