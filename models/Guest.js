const fetchGuests = async () => {
  try {
    const response = await fetch(`${API_BASE}/guests`);
    const data = await response.json();
    
    if (Array.isArray(data)) {
      setGuests(data);
    } else if (data.guests && Array.isArray(data.guests)) {
      setGuests(data.guests);
    } else {
      setGuests([]);
      console.error('Unexpected data format:', data);
    }
  } catch (error) {
    alert('Error fetching guests: ' + error.message);
    setGuests([]);
  }
};