const request = require('supertest');
const app = require('../../backend/index');

describe('Bookings API', () => {
    test('POST /api/bookings/group - should create a group booking', async () => {
        const response = await request(app)
            .post('/api/bookings/group')
            .send({
                propertyId: 1,
                userIds: [1, 2, 3],
                totalCost: 300,
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.groupBooking).toHaveProperty('id');
    });

    test('GET /api/bookings/group/:userId - should fetch group bookings for a user', async () => {
        const response = await request(app).get('/api/bookings/group/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});
