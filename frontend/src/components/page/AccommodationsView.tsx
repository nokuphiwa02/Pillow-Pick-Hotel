import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store'; 
import { createHotel, fetchHotels, deleteHotelById, updateHotelById } from '../../redux/HotelSlice';
import styles from './Accomodation.module.css';
import { addHotelImage } from '../../redux/ImageSlice';

export const AccommodationsView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hotels, loading, error } = useSelector((state: RootState) => state.hotels);
  const[imagePreview, setImagePreview] = useState("")

  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(1);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [editingHotelId, setEditingHotelId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);


  const resetFormFields = () => {
    setHotelName('');
    setAddress('');
    setCity('');
    setRating(1);
    setDescription('');
    setImageFile(null);
    setEditingHotelId(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('hotel_name', hotelName);
  formData.append('address', address);
  formData.append('city', city);
  formData.append('rating', rating.toString());
  formData.append('description', description);

  try {
    if (editingHotelId !== null) {
      const result = await dispatch(
        updateHotelById({
          id: editingHotelId,
          hotelData: formData,
        })
      ).unwrap();

      if (imageFile) {
        await dispatch(
          addHotelImage({
            hotel_id: result.id,
            is_primary: true,
            pictures: [imageFile],
          })
        ).unwrap();
      }
    } else {
      const result = await dispatch(createHotel(formData)).unwrap();

      if (imageFile) {
        await dispatch(
          addHotelImage({
            hotel_id: result.id,
            is_primary: true,
            pictures: [imageFile],
          })
        ).unwrap();
      }
    }

    await dispatch(fetchHotels()).unwrap();
    resetFormFields();
    setImagePreview('');
  } catch (error) {
    console.error('Failed to save hotel or upload image:', error);
  }
};

  

  

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      dispatch(deleteHotelById(id));
    }
  };

  const handleEditClick = (hotel: any) => {
    setEditingHotelId(hotel.id);
    setHotelName(hotel.hotel_name);
    setAddress(hotel.address || '');
    setCity(hotel.city);
    setRating(hotel.rating);
    setDescription(hotel.description || '');
    setImageFile(null); 
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Hotel Management</h1>
      
      {error && <p className={styles.errorMessage}>Error: {error}</p>}

      <div className={styles.formWrapper}>
      
        <h3 className={styles.formTitle}>
          {editingHotelId !== null ? 'Edit Existing Hotel' : 'Add New Hotel'}
        </h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input 
            type="text" 
            placeholder="Hotel Name" 
            value={hotelName} 
            onChange={(e) => setHotelName(e.target.value)} 
            className={styles.inputField}
            required 
          />
          <input 
            type="text" 
            placeholder="Address" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            className={styles.inputField}
            required 
          />
          <input 
            type="text"  
            placeholder="City" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            className={styles.inputField}
            required 
          />
          
          <label className={styles.labelGroup}>
            Rating (1-5):
            <input 
              type="number" 
              min="1" 
              max="7" 
              value={rating} 
              onChange={(e) => setRating(parseInt(e.target.value))} 
              className={styles.inputField}
              required 
            />
          </label>

          <textarea 
            placeholder="Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className={styles.textareaField}
            required 
            rows={4} 
          />
          
          <label className={styles.labelGroup}>
            Upload Image {editingHotelId !== null && '(Leave empty to keep current)'}:
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              required={editingHotelId === null} 
            />
           {imagePreview && (
            <img
            src= {imagePreview}
            />
           )}
          </label>

          {/* Action buttons with flex-gap mapping to prevent stacking issues */}
          <div className={styles.buttonGroup} style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Saving...' : editingHotelId !== null ? 'Update Hotel' : 'Save Hotel'}
            </button>
            {editingHotelId !== null && (
              <button type="button" onClick={resetFormFields} className={styles.cancelButton}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

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
            {hotels.map((hotel) => (
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
                    onClick={() => handleEditClick(hotel)} 
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
  );
};

export default AccommodationsView;
