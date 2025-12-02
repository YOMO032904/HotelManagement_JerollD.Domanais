// In roomRoutes.js - Add debug route
const Room = require('../models/Room');

// Debug route to see all rooms with details
router.get('/debug/all-rooms', async (req, res) => {
  try {
    const rooms = await Room.find({}).lean();
    
    res.json({
      totalCount: rooms.length,
      rooms: rooms.map(room => ({
        id: room._id.toString(),
        roomNumber: room.roomNumber,
        type: room.type,
        price: room.price,
        status: room.status,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Debug route to check specific room number
router.get('/debug/check/:number', async (req, res) => {
  try {
    const roomNumber = parseInt(req.params.number);
    
    if (isNaN(roomNumber)) {
      return res.json({ 
        exists: false, 
        error: 'Invalid room number format' 
      });
    }
    
    const room = await Room.findOne({ roomNumber });
    
    if (room) {
      res.json({ 
        exists: true,
        room: {
          id: room._id,
          roomNumber: room.roomNumber,
          type: room.type,
          price: room.price,
          status: room.status
        }
      });
    } else {
      res.json({ 
        exists: false,
        message: `Room number ${roomNumber} not found in database`
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug route to clear database (use with caution!)
router.delete('/debug/clear-all', async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const result = await Room.deleteMany({});
      res.json({
        message: `Cleared all rooms (${result.deletedCount} deleted)`,
        result
      });
    } else {
      res.status(403).json({ message: 'Not allowed in production' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});