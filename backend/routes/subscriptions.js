const express = require('express');
const prisma = require('../prismaClient');
const router = express.Router();

router.post('/', async (req, res) => {
    const { userId, tier } = req.body;
    const subscription = await prisma.subscription.create({
        data: { userId, tier },
    });
    res.json({ message: 'Subscription added', subscription });
});

module.exports = router;
