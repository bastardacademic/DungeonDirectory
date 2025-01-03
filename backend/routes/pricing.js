const express = require('express');
const prisma = require('../prismaClient');
const router = express.Router();

router.post('/', async (req, res) => {
    const { propertyId, startDate, endDate, price } = req.body;
    const pricingRule = await prisma.pricingRule.create({
        data: { propertyId, startDate, endDate, price },
    });
    res.json({ message: 'Pricing rule added', pricingRule });
});

module.exports = router;
