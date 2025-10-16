const express = require('express');
require('dotenv').config();
const { connectDB } = require('./config/db'); 

const userRoutes = require('./routes/userRoutes');
const userGuests = require('./routes/guestRoutes');
const userRooms = require('./routes/roomRoutes');
const userbooking = require('./routes/bookingRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', userGuests);
app.use('/api', userRooms);
app.use('/api', userbooking);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Hotel Management API running on port ${PORT}`));
});