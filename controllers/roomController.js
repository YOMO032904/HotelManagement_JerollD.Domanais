// In roomController.js - FIXED createRoom function
const createRoom = async (req, res) => {
  try {
    console.log('CREATE ROOM REQUEST BODY:', req.body); // Add logging
    
    const { roomNumber, type, price, status } = req.body;
    
    // FIX: Ensure roomNumber is a number
    const roomNum = parseInt(roomNumber);
    
    if (isNaN(roomNum)) {
      return res.status(400).json({
        message: 'Invalid room number format',
        details: 'Room number must be a valid number'
      });
    }
    
    // FIX: Use the parsed number for duplicate check
    console.log('Checking for room number:', roomNum);
    const existingRoom = await Room.findOne({ roomNumber: roomNum });
    
    console.log('Existing room found:', existingRoom);
    
    if (existingRoom) {
      return res.status(409).json({ 
        message: 'Room number already exists.',
        details: `Room number '${roomNum}' is already in use.`
      });
    }
    
    // Create with the parsed number
    const room = new Room({
      roomNumber: roomNum, // Use parsed number
      type,
      price,
      status: status || 'available'
    });
    
    const savedRoom = await room.save();
    console.log('Room saved successfully:', savedRoom);
    res.status(201).json(savedRoom);
    
  } catch (error) {
    console.error("API /api/rooms POST Error:", error);
    console.error("Error details:", error);

    // Check for duplicate key error
    if (error.code === 11000) {
      // Extract the duplicate key value from error message
      const duplicateValue = error.keyValue?.roomNumber || 'unknown';
      return res.status(409).json({ 
        message: 'Room number already exists.',
        details: `Room number '${duplicateValue}' is already in use.`,
        code: 'DUPLICATE_ROOM_NUMBER'
      });
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        message: 'Validation Failed.',
        details: messages.join('; ') 
      });
    }

    // General error
    res.status(500).json({ 
      message: 'Internal Server Error.', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};