const fetchRooms = async () => {
  try {
    const response = await fetch(`${API_BASE}/rooms`);
    const data = await response.json();
    
    // ⭐ Add this check to ensure data is an array
    if (Array.isArray(data)) {
      setRooms(data);
    } else if (data.rooms && Array.isArray(data.rooms)) {
      // If API returns { rooms: [...] }
      setRooms(data.rooms);
    } else {
      // Fallback to empty array
      setRooms([]);
      console.error('Unexpected data format:', data);
    }
  } catch (error) {
    alert('Error fetching rooms: ' + error.message);
    setRooms([]); // ⭐ Set to empty array on error
  }
};