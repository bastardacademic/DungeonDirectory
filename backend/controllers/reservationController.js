const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createReservation = async (req, res) => {
  const { startDate, endDate, propertyId, duration } = req.body;
  const { id: guestId } = req.user; // Assuming authMiddleware adds user object to req
  try {
    const reservation = await prisma.reservation.create({
      data: {
        startDate,
        endDate,
        propertyId: parseInt(propertyId),
        guestId,
        duration
      }
    });
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

const getReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

const getReservationById = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await prisma.reservation.findUnique({ where: { id: parseInt(id) } });
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404).json({ error: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
};

const updateReservation = async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, duration } = req.body;
  try {
    const reservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { startDate, endDate, duration }
    });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reservation' });
  }
};

const deleteReservation = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.reservation.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
};

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation
};
