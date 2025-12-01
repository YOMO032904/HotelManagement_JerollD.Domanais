// models/Booking.js (Ensure your schema uses these keys)

const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    checkInDate: { // ⬅️ MUST be checkInDate
        type: Date,
        required: true
    },
    checkOutDate: { // ⬅️ MUST be checkOutDate
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        // Make 'required' false or set a default if you calculate it in the controller
    },
    isPaid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);