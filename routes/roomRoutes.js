const express = require('express');
const router = express.Router();
const {
  getRooms,
  getAvailableRooms,  // ← ADD THIS
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');

router.get('/', getRooms); 
router.get('/available', getAvailableRooms);  // ← ADD THIS (MUST BE BEFORE /:id)
router.get('/:id', getRoomById);
router.post('/', createRoom); 
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;