const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const propertiesRoutes = require('./routes/properties');
const bookingsRoutes = require('./routes/bookings');
const usersRoutes = require('./routes/users');

app.use('/api/properties', propertiesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/users', usersRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(Backend running on port );
});
