const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const { initSocket } = require('./utils/notifications');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/reservations', authMiddleware, reservationRoutes);

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(Server running on port );
});
