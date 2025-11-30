const express = require('express');
require('dotenv').config();
const { connectDB } = require('./config/db'); 

const userRoutes = require('./routes/userRoutes');
const userGuests = require('./routes/guestRoutes');
const userRooms = require('./routes/roomRoutes');
const userBookings = require('./routes/bookingRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', userGuests);
app.use('/api', userRooms);
app.use('/api', userBookings);

// Export the app so serverless platforms (Vercel) or tests can import it.
module.exports = app;

// If this file is run directly (node app.js), connect to DB and start the server.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => console.log(`Hotel Management API running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('Failed to start server due to DB connection error:', err);
    });
}