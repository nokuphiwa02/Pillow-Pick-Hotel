import React, { useState } from 'react';


interface Room {
  id: number;
  hotel_id: number;
  room_number: string;
  type: 'Standard' | 'Deluxe' | 'Suite';
  is_available: boolean;
}

export const RoomsView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [rooms] = useState<Room[]>([
    { id: 101, hotel_id: 1, room_number: 'A1', type: 'Deluxe', is_available: true },
    { id: 102, hotel_id: 1, room_number: 'A2', type: 'Suite', is_available: false },
    { id: 103, hotel_id: 2, room_number: 'B1', type: 'Standard', is_available: true },
  ]);

  const filteredRooms = rooms.filter(room => {
    if (filter === 'available') return room.is_available;
    if (filter === 'unavailable') return !room.is_available;
    return true;
  });

  return (
    <div>
      <h2>🛏️ Rooms Directory</h2>
      
     
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <button className="btn-primary" onClick={() => setFilter('all')} style={{ background: filter === 'all' ? '#1e293b' : '#3b82f6' }}>All Rooms</button>
        <button className="btn-primary" onClick={() => setFilter('available')} style={{ background: filter === 'available' ? '#1e293b' : '#3b82f6' }}>Available</button>
        <button className="btn-primary" onClick={() => setFilter('unavailable')} style={{ background: filter === 'unavailable' ? '#1e293b' : '#3b82f6' }}>Unavailable</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Room ID</th>
            <th>Room Number</th>
            <th>Room Type</th>
            <th>Availability Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((room) => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>Room {room.room_number}</td>
              <td><span className="badge" style={{ background: '#f1f5f9', color: '#1e293b' }}>{room.type}</span></td>
              <td>
                <span className={`badge ${room.is_available ? 'available' : 'unavailable'}`}>
                  {room.is_available ? 'Available' : 'Booked / OOO'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
