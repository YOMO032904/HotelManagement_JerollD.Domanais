// Get available rooms
const getAvailableRooms = async (req, res) => {
  try {
    console.log('🔍 Attempting to fetch available rooms...');
    console.log('📦 Room model:', Room.modelName);
    
    const rooms = await Room.find({ status: 'available' });
    
    console.log('✅ Found available rooms:', rooms.length);
    res.json(rooms);
  } catch (error) {
    console.error('❌ FATAL ERROR in getAvailableRooms:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    
    res.status(500).json({ 
      message: 'Error fetching available rooms',
      error: error.message,
      details: 'Check server console for full error'
    });
  }
};