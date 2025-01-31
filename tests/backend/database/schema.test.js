const prisma = require('../../backend/prismaClient');

describe('Database Schema', () => {
    test('Should create and fetch a group booking', async () => {
        const booking = await prisma.groupBooking.create({
            data: {
                propertyId: 1,
                userIds: '1,2,3',
                totalCost: 300,
            },
        });

        const fetchedBooking = await prisma.groupBooking.findUnique({ where: { id: booking.id } });
        expect(fetchedBooking.totalCost).toBe(300);
    });
});
