import React, { useState } from 'react';


interface Booking {
  id: number;
  user_id: number;
  user_name: string; 
  room_id: number;
  check_in: string;
  booking_status: 'Pending' | 'Cancelled' | 'Approve';
}

export const BookingsView: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    { id: 1, user_id: 42, user_name: 'Nokuphiwa Shange', room_id: 101, check_in: '2026-11-01', booking_status: 'Approve' },
    { id: 2, user_id: 88, user_name: 'Nolwazi Dlamini', room_id: 102, check_in: '2026-11-05', booking_status: 'Pending' },
  ]);

  const updateStatus = (bookingId: number, newStatus: 'Pending' | 'Cancelled' | 'Approve') => {

    setBookings(bookings.map(b => b.id === bookingId ? { ...b, booking_status: newStatus } : b));
  };

  return (
    <div>
      <h2>👥 Guest Reservations & User Activity</h2>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Guest (User ID)</th>
            <th>Assigned Room ID</th>
            <th>Check-In Date</th>
            <th>Live Status</th>
            <th>Admin Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>#{booking.id}</td>
              <td>{booking.user_name} (ID: {booking.user_id})</td>
              <td>Room #{booking.room_id}</td>
              <td>{booking.check_in}</td>
              <td>
                <span className={`badge ${
                  booking.booking_status === 'Approve' ? 'available' : 
                  booking.booking_status === 'Cancelled' ? 'unavailable' : 'pending-badge'
                }`}>
                  {booking.booking_status}
                </span>
              </td>
              <td>
                <select 
                  value={booking.booking_status} 
                  onChange={(e) => updateStatus(booking.id, e.target.value as any)}
                  style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Pending">Set Pending</option>
                  <option value="Approve">Approve</option>
                  <option value="Cancelled">Cancel</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
