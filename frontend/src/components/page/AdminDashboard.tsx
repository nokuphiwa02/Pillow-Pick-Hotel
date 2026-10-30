
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RoomsView } from '../page/RoomsView';
import profile from '../../assets/profile.png';
import styles from './AdminDashboard.module.css';
import type { RootState, AppDispatch } from '../../../store';
import { fetchHotels } from '../../redux/HotelSlice';
import { fetchRooms } from '../../redux/RoomSlice';
import {
  fetchBookings,
  deleteBooking,
} from '../../redux/BookingSlice';
import {
  fetchUsers,
  deleteUser,
} from '../../redux/UserSlice';

type DashboardView =
  | 'overview'
  | 'bookings'
  | 'users'
  | 'rooms';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [currentView, setCurrentView] =
    useState<DashboardView>('overview');

  const [deletingBookingId, setDeletingBookingId] =
    useState<number | null>(null);

  const [deletingUserId, setDeletingUserId] =
    useState<number | null>(null);

  const hotels = useSelector(
    (state: RootState) => state.hotels.hotels
  );

  const rooms = useSelector(
    (state: RootState) => state.rooms.rooms
  );

  const bookings = useSelector(
    (state: RootState) => state.bookings.bookings
  );

  const bookingsLoading = useSelector(
    (state: RootState) => state.bookings.loading
  );

  const bookingsError = useSelector(
    (state: RootState) => state.bookings.error
  );

  const users = useSelector(
    (state: RootState) => state.users.users
  );

  const usersLoading = useSelector(
    (state: RootState) => state.users.loading
  );

  const usersError = useSelector(
    (state: RootState) => state.users.error
  );

  useEffect(() => {
    dispatch(fetchHotels());
    dispatch(fetchRooms());
    dispatch(fetchBookings());
    dispatch(fetchUsers());
  }, [dispatch]);

  // DELETE BOOKING
  const handleDeleteBooking = async (
    bookingId: number
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete booking #${bookingId}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingBookingId(bookingId);

    try {
      const result = await dispatch(
        deleteBooking(bookingId)
      );

      if (deleteBooking.fulfilled.match(result)) {
        window.alert(
          `Booking #${bookingId} was deleted successfully.`
        );
      } else {
        window.alert(
          String(
            result.payload ??
              'Failed to delete booking. Please try again.'
          )
        );
      }
    } catch {
      window.alert(
        'An unexpected error occurred while deleting the booking.'
      );
    } finally {
      setDeletingBookingId(null);
    }
  };

  // DELETE USER
  const handleDeleteUser = async (userId: number) => {
    const selectedUser = users.find(
      (user) => user.id === userId
    );

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        selectedUser?.name || `user #${userId}`
      }? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingUserId(userId);

    try {
      const result = await dispatch(deleteUser(userId));

      if (deleteUser.fulfilled.match(result)) {
        window.alert(
          `User #${userId} was deleted successfully.`
        );
      } else {
        window.alert(
          String(
            result.payload ??
              'Failed to delete user. Please try again.'
          )
        );
      }
    } catch {
      window.alert(
        'An unexpected error occurred while deleting the user.'
      );
    } finally {
      setDeletingUserId(null);
    }
  };

  const stats = [
    {
      title: 'ACCOMMODATIONS',
      value: hotels.length,
      route: '/admin/accommodation',
    },
    {
      title: 'ROOMS',
      value: rooms.length,
      route: '/admin/rooms',
    },
    {
      title: 'BOOKINGS',
      value: bookings.length,
      view: 'bookings' as DashboardView,
    },
    {
      title: "USERS",
      value: users.length,
      route: "/admin/users",
    },
  ];

  const renderMainContent = () => {
    switch (currentView) {
      case 'overview':
        return (
          <>
            <header className={styles.welcomeHeader}>
              Welcome back to HavenStay Admin.

              <button
                type="button"
                className={styles.profileButton}
                onClick={() => navigate('/profile')}
                title="My Profile"
                aria-label="Open my profile"
              >
                <img
                  src={profile}
                  alt="Profile"
                  className={styles.profile}
                />
              </button>
            </header>

            <section className={styles.statsGrid}>
              {stats.map((stat) => (
                <button
                  key={stat.title}
                  type="button"
                  className={styles.statCard}
                  onClick={() => {
                    if (stat.route) {
                      navigate(stat.route);
                    } else if (stat.view) {
                      setCurrentView(stat.view);
                    }
                  }}
                >
                  <h3>{stat.title}</h3>
                  <p>{stat.value}</p>
                </button>
              ))}
            </section>
          </>
        );

      case 'rooms':
        return <RoomsView />;

      case 'bookings':
        return (
          <section className={styles.pageContent}>
            <h2>📅 Bookings Records</h2>

            <p className={styles.pageDescription}>
              View and manage customer bookings.
            </p>

            {bookingsLoading && (
              <p>Loading bookings...</p>
            )}

            {bookingsError && (
              <p role="alert">
                Failed to load bookings: {bookingsError}
              </p>
            )}

            {!bookingsLoading &&
              !bookingsError &&
              bookings.length === 0 && (
                <p>No bookings found.</p>
              )}

            {bookings.length > 0 && (
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>User ID</th>
                      <th>Room ID</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Guests</th>
                      <th>Total Price</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.user_id}</td>
                        <td>{booking.room_id}</td>
                        <td>
                          {String(
                            booking.check_in
                          ).slice(0, 10)}
                        </td>
                        <td>
                          {String(
                            booking.check_out
                          ).slice(0, 10)}
                        </td>
                        <td>{booking.guest_number}</td>
                        <td>
                          R
                          {Number(
                            booking.total_price
                          ).toFixed(2)}
                        </td>
                        <td>{booking.booking_status}</td>
                        <td>
                          {booking.created_at
                            ? String(
                                booking.created_at
                              ).slice(0, 10)
                            : '—'}
                        </td>
                        <td>
                          <button
                            type="button"
                            className={
                              styles.deleteBookingButton
                            }
                            onClick={() =>
                              handleDeleteBooking(
                                booking.id
                              )
                            }
                            disabled={
                              deletingBookingId ===
                              booking.id
                            }
                          >
                            {deletingBookingId ===
                            booking.id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );

      case 'users':
        return (
          <section className={styles.pageContent}>
            <h2>👥 Registered Application Users</h2>

            <p className={styles.pageDescription}>
              View and manage registered HavenStay users.
            </p>

            {usersLoading && <p>Loading users...</p>}

            {usersError && (
              <p role="alert">
                Failed to load users: {usersError}
              </p>
            )}

            {!usersLoading &&
              !usersError &&
              users.length === 0 && (
                <p>No registered users found.</p>
              )}

            {users.length > 0 && (
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>Registration Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name || '—'}</td>
                        <td>{user.email || '—'}</td>
                        <td>{user.role || 'guest'}</td>
                        <td>
                          {user.createdat
                            ? String(
                                user.createdat
                              ).slice(0, 10)
                            : '—'}
                        </td>
                        <td>
                          <button
                            type="button"
                            className={
                              styles.deleteBookingButton
                            }
                            onClick={() =>
                              handleDeleteUser(user.id)
                            }
                            disabled={
                              deletingUserId === user.id
                            }
                          >
                            {deletingUserId === user.id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <nav className={styles.sidebarNav}>
          <button
            type="button"
            className={`${styles.sidebarLinkBtn} ${
              currentView === 'overview'
                ? styles.active
                : ''
            }`}
            onClick={() => setCurrentView('overview')}
          >
            📊 Overview
          </button>

          <button
            type="button"
            className={styles.sidebarLinkBtn}
            onClick={() =>
              navigate('/admin/accommodation')
            }
          >
            🏠 Accommodations
          </button>

          <button
            type="button"
            className={styles.sidebarLinkBtn}
            onClick={() => navigate('/admin/rooms')}
          >
            🛏️ Rooms
          </button>

          <button
            type="button"
            className={`${styles.sidebarLinkBtn} ${
              currentView === 'bookings'
                ? styles.active
                : ''
            }`}
            onClick={() => setCurrentView('bookings')}
          >
            📅 Bookings
          </button>

          <button
            type="button"
            className={`${styles.sidebarLinkBtn} ${
              currentView === 'users'
                ? styles.active
                : ''
            }`}
            onClick={() => setCurrentView('users')}
          >
            👤 Users
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        {renderMainContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
