import React, { useState } from 'react';
import { OverviewView } from '../page/OverviewView';
import { AccommodationsView } from '../page/AccommodationsView';
// import { RoomsView } from '../page/RoomsView';
// import { BookingsView } from '../page/BookingsView';
import styles from './AdminDashboard.module.css';

type DashboardView = 'overview' | 'accommodations' | 'bookings' | 'users' | 'rooms';

export const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');


  const [stats] = useState({
    hotels: 24,
    rooms: 145,
    bookings: 42,
    users: 512
  });

 
  const renderMainContent = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView setView={setCurrentView} stats={stats} />;
      case 'accommodations':
        return <AccommodationsView />;
    //   case 'rooms':
    //     return <RoomsView />;
    //   case 'bookings':
    //     return <BookingsView />;
    //   case 'users':
        return (
          <div>
            <h2>👥 Registered Application Users</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Viewing all accounts registered via OAuth profile sync.</p>
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
                  <td>ID: 42</td>
                  <td><strong>Nokuphiwa shange</strong></td>
                  <td>nokuphiwashange@example.com</td>
                  <td><span className={`${styles.badge} ${styles.available}`}>Active Account</span></td>
                </tr>
                <tr>
                  <td>ID: 88</td>
                  <td><strong>Nolwazi Dlamini</strong></td>
                  <td>nolwazi@example.com</td>
                  <td><span className={`${styles.badge} ${styles.available}`}>Active Account</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      default:
        return <OverviewView setView={setCurrentView} stats={stats} />;
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar Navigation Links */}
      <aside className={styles.sidebar}>
        <h2 onClick={() => setCurrentView('overview')} style={{ cursor: 'pointer' }}>
          Pillow-Pick Admin
        </h2>
        
        <button 
          className={`${styles.sidebarLinkBtn} ${currentView === 'overview' ? styles.active : ''}`}
          onClick={() => setCurrentView('overview')}
        >
          📊 Dashboard Overview
        </button>
        
        <button 
          className={`${styles.sidebarLinkBtn} ${currentView === 'accommodations' ? styles.active : ''}`}
          onClick={() => setCurrentView('accommodations')}
        >
          🏨 Accommodations
        </button>
        
        <button 
          className={`${styles.sidebarLinkBtn} ${currentView === 'bookings' ? styles.active : ''}`}
          onClick={() => setCurrentView('bookings')}
        >
          📅 Bookings Record
        </button>

        <button 
          className={`${styles.sidebarLinkBtn} ${currentView === 'users' ? styles.active : ''}`}
          onClick={() => setCurrentView('users')}
        >
          👥 Registered Users
        </button>
        
        <button 
          className={`${styles.sidebarLinkBtn} ${currentView === 'rooms' ? styles.active : ''}`}
          onClick={() => setCurrentView('rooms')}
        >
          🛏️ Rooms Inventory
        </button>
      </aside>
      
      {/* Dynamic Workspace Container */}
      <main className={styles.mainContent}>
        {renderMainContent()}
      </main>
    </div>
  );
};
