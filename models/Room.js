import React, { useState, useEffect } from 'react';
import RoomForm from './RoomForm';

const API_BASE = 'https://crud-theta-three.vercel.app/api';

function Rooms() {
  const [rooms, setRooms] = useState([]); // ⭐ Initialize as empty array
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_BASE}/rooms`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Rooms data:', data);
      
      if (Array.isArray(data)) {
        setRooms(data);
      } else if (data.rooms && Array.isArray(data.rooms)) {
        setRooms(data.rooms);
      } else {
        console.error('Unexpected data format:', data);
        setRooms([]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      alert('Error fetching rooms: ' + error.message);
      setRooms([]);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await fetch(`${API_BASE}/rooms/available`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setRooms(data);
      } else if (data.rooms && Array.isArray(data.rooms)) {
        setRooms(data.rooms);
      } else {
        setRooms([]);
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      alert('Error fetching available rooms: ' + error.message);
      setRooms([]);
    }
  };

  const handleSave = async (roomData) => {
    try {
      const url = editingRoom 
        ? `${API_BASE}/rooms/${editingRoom._id}`
        : `${API_BASE}/rooms`;
      
      const method = editingRoom ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchRooms();
      setShowForm(false);
      setEditingRoom(null);
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Error saving room: ' + error.message);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/rooms/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Error deleting room: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Rooms</h1>
      <button onClick={() => { setShowForm(true); setEditingRoom(null); }}>
        Add Room
      </button>
      <button onClick={fetchAvailableRooms}>Show Available Rooms</button>
      <button onClick={fetchRooms}>Show All Rooms</button>

      {showForm && (
        <RoomForm 
          room={editingRoom} 
          onSave={handleSave} 
          onCancel={() => { setShowForm(false); setEditingRoom(null); }}
        />
      )}

      <h2>All Rooms</h2>
      {rooms && rooms.length > 0 ? (
        <div>
          {rooms.map((room) => (
            <div key={room._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <p><strong>Room Number:</strong> {room.roomNumber}</p>
              <p><strong>Type:</strong> {room.type}</p>
              <p><strong>Price:</strong> ${room.price}</p>
              <p><strong>Status:</strong> {room.status}</p>
              <button onClick={() => handleEdit(room)}>Edit</button>
              <button onClick={() => handleDelete(room._id)}>Delete</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No rooms found. Add some rooms to get started!</p>
      )}
    </div>
  );
}

export default Rooms;