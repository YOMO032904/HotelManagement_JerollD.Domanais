const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS - IMPORTANT: Add this BEFORE your routes
app.use(cors({
  origin: '*', // Allows all origins (good for development)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

// Your existing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes
const guestRoutes = require('./routes/guestRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/guests', guestRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// ... rest of your code