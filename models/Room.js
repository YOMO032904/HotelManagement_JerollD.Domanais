const mongoose = require('mongoose');

// Define the correct schema for a Room
const roomSchema = new mongoose.Schema({
  roomNumber: { // Unique identifier for the room
    type: String,
    required: true,
    unique: true
  },
  type: { // ✅ FIXED: Renamed from 'roomType' to 'type' for consistency
    type: String,
    enum: ['single', 'double', 'deluxe', 'suite'], // Added common enum values
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'], // Status must be one of these
    default: 'available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);