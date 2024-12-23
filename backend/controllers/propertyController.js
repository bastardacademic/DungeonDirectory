const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendNotification } = require('../utils/notifications');

const createProperty = async (req, res) => {
  const { name, description, location, price, availability } = req.body;
  const { id: ownerId } = req.user; // Assuming authMiddleware adds user object to req
  try {
    const property = await prisma.property.create({
      data: {
        name,
        description,
        location,
        price,
        availability,
        ownerId
      }
    });
    sendNotification(ownerId, 'Your property has been successfully created.');
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
};

// ... other methods remain unchanged

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
};
