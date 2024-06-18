const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
};

const getProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

const getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({ where: { id: parseInt(id) } });
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};

const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { name, description, location, price, availability } = req.body;
  try {
    const property = await prisma.property.update({
      where: { id: parseInt(id) },
      data: { name, description, location, price, availability }
    });
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
};

const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.property.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
};
