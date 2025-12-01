const Room = require('../models/Room');
const Booking = require('../models/Booking'); // ⬅️ NEW: Import Booking model

// Get all rooms
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🎯 FIX APPLIED HERE: Get available rooms based on date range
const getAvailableRooms = async (req, res) => {
    try {
        const { checkIn, checkOut } = req.query;

        if (!checkIn || !checkOut) {
            // If dates are not provided, fall back to rooms marked 'Available'
            const availableRooms = await Room.find({ status: 'Available' });
            return res.status(200).json(availableRooms);
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkInDate >= checkOutDate) {
            return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
        }

        // 1. Find all Room IDs that are booked during the specified period
        // The query finds any booking whose time range overlaps with the requested time range.
        const bookedRoomIds = await Booking.find({
            $or: [
                // Scenario 1: Existing booking overlaps the start or end date of the new period
                { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },

                // Scenario 2: Existing booking completely contains the new period
                { checkInDate: { $lte: checkInDate }, checkOutDate: { $gte: checkOutDate } },
            ]
        }).select('roomId');

        const occupiedRoomIds = bookedRoomIds.map(booking => booking.roomId);

        // 2. Find all Rooms whose IDs are NOT in the occupied list
        const availableRooms = await Room.find({
            _id: { $nin: occupiedRoomIds },
            status: 'Available' // Ensure we only consider rooms available for booking
        });

        res.status(200).json(availableRooms);
    } catch (error) {
        console.error('Error fetching available rooms:', error);
        res.status(500).json({ message: 'Server error while fetching availability.' });
    }
};

// Get room by ID
const getRoomById = async (req, res) => {
// ... (rest of the functions remain the same)
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new room
const createRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        const savedRoom = await room.save();
        res.status(201).json(savedRoom);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Room number already exists' });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};

// Update room
const updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete room
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRooms,
    getAvailableRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
};