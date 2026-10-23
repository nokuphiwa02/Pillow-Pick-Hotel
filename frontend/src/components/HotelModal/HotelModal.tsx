import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import { createHotel, updateHotelById, fetchHotels } from '../../redux/HotelSlice';
import { addHotelImage } from '../../redux/ImageSlice';
import styles from './HotelModal.module.css';

interface HotelModalProps {
  editingHotel?: any | null; // Added '?' to make it optional
  onClose?: () => void;      // Added '?' to make it optional
}

export const HotelModal: React.FC<HotelModalProps> = ({ 
  editingHotel = null, 
  onClose = () => {} 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.hotels);

  // Form States
  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(1);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  // Populate form fields if editing an existing hotel
  useEffect(() => {
    if (editingHotel) {
      setHotelName(editingHotel.hotel_name || '');
      setAddress(editingHotel.address || '');
      setCity(editingHotel.city || '');
      setRating(editingHotel.rating || 1);
      setDescription(editingHotel.description || '');
    }
  }, [editingHotel]);

  // Clean up image preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('hotel_name', hotelName);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('rating', rating.toString());
    formData.append('description', description);

    try {
      if (editingHotel) {
        const result = await dispatch(
          updateHotelById({
            id: editingHotel.id,
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
      onClose(); // Close the modal on successful submit
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Failed to save hotel or upload image:', errorMessage);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.formTitle}>
            {editingHotel ? 'Edit Existing Hotel' : 'Add New Hotel'}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        
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
              max="5" 
              value={rating} 
              onChange={(e) => setRating(parseInt(e.target.value) || 1)} 
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
            Upload Image {editingHotel && '(Leave empty to keep current)'}:
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              required={!editingHotel} 
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
            )}
          </label>
          
          <div className={styles.buttonGroup}>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Saving...' : editingHotel ? 'Update Hotel' : 'Save Hotel'}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HotelModal;