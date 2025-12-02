// ... imports and other functions

// @desc    Create new room
// @route   POST /api/rooms
// @access  Public (or relevant auth)
exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, type, price, status } = req.body;

    // Optional: Basic validation before hitting the database
    if (!roomNumber || !price) {
      return res.status(400).json({ message: 'Room number and price are required.' });
    }

    const newRoom = new Room({ roomNumber, type, price, status });
    const savedRoom = await newRoom.save();

    res.status(201).json(savedRoom);
  } catch (error) {
    console.error('Error creating room:', error);

    // Mongoose Duplicate Key Error (Code 11000)
    if (error.code === 11000) {
      // The conflict is permanent, so we return 409 Conflict immediately.
      return res.status(409).json({ 
        message: `Room number '${req.body.roomNumber}' already exists. Please choose a different number.` 
      });
    }

    // Mongoose Validation Error (e.g., price is missing or status is invalid)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    // Generic server error
    res.status(500).json({ message: 'Failed to create room due to a server error.' });
  }
};

// ... other functions