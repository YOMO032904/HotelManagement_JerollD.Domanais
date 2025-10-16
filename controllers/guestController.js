const Guest = require('../models/Guest');

// Get all guests
const getGuests = async (req, res) => {
  try {
    const guests = await Guest.find();
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get guest by ID
const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new guest
const createGuest = async (req, res) => {
  try {
    const guest = new Guest(req.body);
    const savedGuest = await guest.save();
    res.status(201).json(savedGuest);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// Update guest
const updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete guest
const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest
};