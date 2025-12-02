const mongoose = require('mongoose');

// Define the correct schema for a Room
const roomSchema = new mongoose.Schema({
    roomNumber: { // Unique numerical identifier for the room
        type: Number, // 🚨 CRITICAL CHANGE: Changed from String to Number
        required: [true, 'Room number is required.'],
        unique: true, // Ensures no duplicates exist
        min: 1
    },
    type: { // Room category (e.g., single, double)
        type: String,
        enum: ['single', 'double', 'deluxe', 'suite'],
        required: [true, 'Room type is required.'],
        lowercase: true,
        trim: true // Removes whitespace
    },
    price: { // Price per night
        type: Number,
        required: [true, 'Price is required.'],
        min: 0.01
    },
    status: { // Current room occupancy state
        type: String,
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available',
        lowercase: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);