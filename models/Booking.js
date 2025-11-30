// In Rooms.js
const [rooms, setRooms] = useState([]); // ⭐ Empty array, not null

// In Guests.js
const [guests, setGuests] = useState([]); // ⭐ Empty array, not null

// In Bookings.js
const [bookings, setBookings] = useState([]); // ⭐ Empty array, not null

const fetchBookings = async () => {
  try {
    const response = await fetch(`${API_BASE}/bookings`);
    const data = await response.json();
    
    if (Array.isArray(data)) {
      setBookings(data);
    } else if (data.bookings && Array.isArray(data.bookings)) {
      setBookings(data.bookings);
    } else {
      setBookings([]);
      console.error('Unexpected data format:', data);
    }
  } catch (error) {
    alert('Error fetching bookings: ' + error.message);
    setBookings([]);
  }
};