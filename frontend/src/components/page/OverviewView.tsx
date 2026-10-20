import React from 'react';


type DashboardView = 'overview' | 'accommodations' | 'bookings' | 'users' | 'rooms';

interface Stats {
  hotels: number;
  rooms: number;
  bookings: number;
  users: number;
}

interface OverviewViewProps {
  stats: Stats;
  setView: (view: DashboardView) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ stats, setView }) => {
  return (
    <div className="overview-container">
      <div className="overview-header">
        <h2>📊 Dashboard Overview</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Welcome back to Pillow-Pick Admin. Here is a quick snapshot of your system performance.
        </p>
      </div>

    
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="stat-card" onClick={() => setView('accommodations')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">🏨</div>
          <div className="stat-info">
            <h3>Accommodations</h3>
            <p className="stat-number">{stats.hotels}</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => setView('rooms')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">🛏️</div>
          <div className="stat-info">
            <h3>Rooms Inventory</h3>
            <p className="stat-number">{stats.rooms}</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => setView('bookings')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Bookings Record</h3>
            <p className="stat-number">{stats.bookings}</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => setView('users')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Registered Users</h3>
            <p className="stat-number">{stats.users}</p>
          </div>
        </div>

      </div>

      <div className="recent-activity-section">
        <h3>⚡ Quick Operations</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className="sidebar-link-btn active" onClick={() => setView('bookings')}>
            View Recent Bookings
          </button>
          <button className="sidebar-link-btn active" onClick={() => setView('accommodations')}>
            Manage Properties
          </button>
        </div>
      </div>
    </div>
  );
};
