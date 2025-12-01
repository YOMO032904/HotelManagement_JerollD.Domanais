import React, { useState, useEffect } from 'react';
import BookingForm from './BookingForm';

const API_BASE = 'https://crud-theta-three.vercel.app/api';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [guestIdFilter, setGuestIdFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/bookings`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Received bookings data:', data);
      
      // Ensure we always set an array
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Error fetching bookings: ' + error.message);
      setBookings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingsByGuest = async () => {
    if (!guestIdFilter) {
      alert('Please enter a guest ID.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/bookings/guest/${guestIdFilter}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Received bookings by guest data:', data);
      
      // Ensure we always set an array
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings by guest:', error);
      alert('Error fetching bookings by guest: ' + error.message);
      setBookings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Cancel this booking?')) {
      try {
        const response = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        fetchBookings();
      } catch (error) {
        console.error('Error canceling booking:', error);
        alert('Error canceling booking: ' + error.message);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bookings</h1>
      <button onClick={() => { setShowForm(true); setEditingBooking(null); }}>Add Booking</button>
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Guest ID"
          value={guestIdFilter}
          onChange={(e) => setGuestIdFilter(e.target.value)}
          style={{ marginRight: '5px' }}
        />
        <button onClick={fetchBookingsByGuest}>Filter by Guest</button>
        <button onClick={fetchBookings} style={{ marginLeft: '5px' }}>Show All</button>
      </div>
      
      {showForm && (
        <BookingForm
          booking={editingBooking}
          onSave={() => { fetchBookings(); setShowForm(false); }}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found. Add one to get started!</p>
      ) : (
        <ul>
          {bookings.map(booking => (
            <li key={booking._id}>
              Guest: {booking.guestId?.name || booking.guestId} - 
              Email: {booking.guestId?.email || 'N/A'} - 
              Room: {booking.roomId?.number || booking.roomId} - 
              Type: {booking.roomId?.type || 'N/A'} - 
              Check-in: {new Date(booking.checkInDate).toLocaleDateString()} - 
              Check-out: {new Date(booking.checkOutDate).toLocaleDateString()} - 
              Total: ${booking.totalAmount || 0}
              <button onClick={() => { setEditingBooking(booking); setShowForm(true); }} style={{ marginLeft: '10px' }}>Edit</button>
              <button onClick={() => handleDelete(booking._id)} style={{ marginLeft: '5px' }}>Cancel</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Bookings;