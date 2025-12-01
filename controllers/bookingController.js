// controllers/bookingController.js (Key section for createBooking)
// ... requires Room and Booking models

const createBooking = async (req, res) => {
    try {
        const { guestId, roomId, checkInDate, checkOutDate } = req.body;
        
        // ... (Validation and Availability Check logic remains the same) ...

        // 3. Price Calculation (This solves the totalAmount: NaN error)
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        
        // Calculate number of nights
        const MS_PER_DAY = 1000 * 60 * 60 * 24;
        const nights = Math.ceil((checkOut - checkIn) / MS_PER_DAY);
        
        const totalAmount = nights * room.price; // ⬅️ This sets the required number value

        // 4. Create and Save Booking
        const booking = new Booking({
            ...req.body,
            totalAmount: totalAmount // Set the calculated amount
        });

        const savedBooking = await booking.save();
        res.status(201).json(savedBooking);

    } catch (error) {
        // ... (Error handling)
        res.status(400).json({ message: `Booking validation failed: ${error.message}` });
    }
};

// ... (other exports)