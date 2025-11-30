const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

// GET all guests
router.get('/', guestController.getAllGuests);

// GET single guest
router.get('/:id', guestController.getGuestById);

// POST create guest
router.post('/', guestController.createGuest);

// PUT update guest
router.put('/:id', guestController.updateGuest);

// DELETE guest
router.delete('/:id', guestController.deleteGuest);

module.exports = router;