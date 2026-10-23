import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store'; 
import { fetchHotels, deleteHotelById } from '../../redux/HotelSlice';
import HotelModal from '../HotelModal/HotelModal'; 
import styles from './Accomodation.module.css';

export const Accommodation: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hotels, loading, error } = useSelector((state: RootState) => state.hotels);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotelToEdit, setSelectedHotelToEdit] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      dispatch(deleteHotelById(id));
    }
  };

  const handleOpenAddModal = () => {
    setSelectedHotelToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (hotel: any) => {
    setSelectedHotelToEdit(hotel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHotelToEdit(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className={styles.title}>Admin Hotel Management</h1>
        <button onClick={handleOpenAddModal} className={styles.addButton}>
          + Add New Hotel
        </button>
      </div>
      
      {error && <p className={styles.errorMessage}>Error: {error}</p>}

      {/* Conditional Modal Render */}
      {isModalOpen && (
        <HotelModal 
          editingHotel={selectedHotelToEdit} 
          onClose={handleCloseModal} 
        />
      )}

      {/* Table List Section */}
      <div className={styles.listSection}>
        <h3 className={styles.sectionTitle}>All Existing Hotels</h3>
        {loading && <p className={styles.loadingText}>Loading...</p>}
        
        <div className={styles.tableWrapper}>
          <table className={styles.hotelTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Image</th>
                <th className={styles.tableHeader}>Name</th>
                <th className={styles.tableHeader}>City</th>
                <th className={styles.tableHeader}>Rating</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels?.map((hotel) => (
                <tr key={hotel.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    {hotel.image_url ? (
                      <img 
                        src={`http://localhost:5000/${hotel.image_url}`} 
                        alt={hotel.hotel_name} 
                        className={styles.hotelImage} 
                      />
                    ) : (
                      <span className={styles.noImagePlaceholder}>No Image</span>
                    )}
                  </td>
                  <td className={styles.tableCell}>{hotel.hotel_name}</td>
                  <td className={styles.tableCell}>{hotel.city}</td>
                  <td className={styles.tableCell}>{hotel.rating} / 5</td>
                  <td className={styles.tableCell}>
                    <button 
                      onClick={() => handleDelete(hotel.id)} 
                      className={styles.deleteButton}
                      style={{ marginRight: '8px' }}
                    >
                      Delete
                    </button>
                    
                    <button 
                      onClick={() => handleOpenEditModal(hotel)} 
                      className={styles.updateButton}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Accommodation;