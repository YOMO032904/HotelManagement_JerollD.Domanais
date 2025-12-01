// Add this AFTER getRooms function
// Get available rooms
const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'available' });
    res.json(rooms);
  } catch (error) {
    console.error('Error in getAvailableRooms:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRooms,
  getAvailableRooms,  // ← ADD THIS
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
};