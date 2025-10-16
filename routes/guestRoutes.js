const express = require('express');
const router = express.Router();
const {
  getGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest
} = require('../controllers/guestController');

router.get('/guests', getGuests);
router.get('/guests/:id', getGuestById);
router.post('/guests', createGuest);
router.put('/guests/:id', updateGuest);
router.delete('/guests/:id', deleteGuest);

module.exports = router;