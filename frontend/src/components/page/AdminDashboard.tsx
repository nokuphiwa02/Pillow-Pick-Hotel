
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RoomsView } from '../page/RoomsView';
import profile from '../../assets/profile.png';
import styles from './AdminDashboard.module.css';
import type { RootState, AppDispatch } from '../../../store';
import { fetchHotels } from '../../redux/HotelSlice';
import { fetchRooms } from '../../redux/RoomSlice';

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

  // Get actual hotel and room records from Redux
  const hotels = useSelector(
    (state: RootState) => state.hotels.hotels
  );

  const rooms = useSelector(
    (state: RootState) => state.rooms.rooms
  );

  // Fetch the latest records when the dashboard loads
  useEffect(() => {
    dispatch(fetchHotels());
    dispatch(fetchRooms());
  }, [dispatch]);

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
      value: 0,
      view: 'bookings' as DashboardView,
    },
    {
      title: 'USERS',
      value: 0,
      view: 'users' as DashboardView,
    },
  ];

  const renderMainContent = () => {
    switch (currentView) {
      case 'overview':
        return (
          <>
            <header className={styles.welcomeHeader}>
              Welcome back to Pillow-Pick Admin.
              <img
                src={profile}
                alt="profile"
                className={styles.profile}
              />
            </header>

            <section className={styles.statsGrid}>
              {stats.map((stat) => (
                <button
                  key={stat.title}
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
            <h2>📅 Bookings Record</h2>
            <p>View and manage your bookings here.</p>
          </section>
        );

      case 'users':
        return (
          <section className={styles.pageContent}>
            <h2>👥 Registered Application Users</h2>
            <p className={styles.pageDescription}>
              Viewing registered user accounts.
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email Reference</th>
                    <th>Account Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>ID: 20</td>
                    <td>
                      <strong>Nokuphiwa Shange</strong>
                    </td>
                    <td>nokuphiwashange@example.com</td>
                    <td>
                      <span className={styles.badge}>
                        Active Account
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
            className={`${styles.sidebarLinkBtn} ${
              currentView === 'overview' ? styles.active : ''
            }`}
            onClick={() => setCurrentView('overview')}
          >
            📊 Overview
          </button>

          <button
            className={styles.sidebarLinkBtn}
            onClick={() => navigate('/admin/accommodation')}
          >
            🏠 Accommodations
          </button>

          <button
            className={styles.sidebarLinkBtn}
            onClick={() => navigate('/admin/rooms')}
          >
            🛏️ Rooms
          </button>

          <button
            className={`${styles.sidebarLinkBtn} ${
              currentView === 'bookings' ? styles.active : ''
            }`}
            onClick={() => setCurrentView('bookings')}
          >
            📞 Bookings
          </button>

          <button
            className={`${styles.sidebarLinkBtn} ${
              currentView === 'users' ? styles.active : ''
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