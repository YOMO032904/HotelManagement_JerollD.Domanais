const express = require('express');
const router = express.Router();

// Import route files
const roomRoutes = require('./roomRoutes');
const guestRoutes = require('./guestRoutes');
const bookingRoutes = require('./bookingRoutes');

// Use the routes
router.use('/rooms', roomRoutes);
router.use('/guests', guestRoutes);
router.use('/bookings', bookingRoutes);

// Test route
router.get('/', (req, res) => {
  res.json({ 
    message: 'Hotel Management API is working!',
    endpoints: {
      rooms: '/api/rooms',
      guests: '/api/guests', 
      bookings: '/api/bookings'
    }
  });
});

module.exports = router;