
import React, { useEffect, useState } from "react";
import styles from "../page/RoomsView.module.css";

export type RoomFormValues = {
  hotel_id: string;
  room_type: string;
  capacity: string;
  quantity: string;
  description: string;
  facilities: string;
  price_per_night: string;
};

interface RoomModalProps {
  initialValues: RoomFormValues;
  editingRoomId: number | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: RoomFormValues, imageFile: File | null) => void;
}

const RoomModal: React.FC<RoomModalProps> = ({
  initialValues,
  editingRoomId,
  loading,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<RoomFormValues>(initialValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (file && !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      setImageFile(null);
      return;
    }

    setImageFile(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form, imageFile);
  };

  return (
    <div
      className={styles.modalOverlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-modal-title"
      >
        <div className={styles.modalHeader}>
          <h2 id="room-modal-title">
            {editingRoomId !== null ? "Update Room" : "Create New Room"}
          </h2>

          <button
            type="button"
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <form className={styles.roomForm} onSubmit={handleSubmit}>
          <div className={styles.modalFormGrid}>
            <div className={styles.modalField}>
              <label htmlFor="hotel_id">Hotel ID</label>
              <input
                id="hotel_id"
                name="hotel_id"
                type="number"
                min="1"
                value={form.hotel_id}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.modalField}>
              <label htmlFor="room_type">Room Type</label>
              <select
                id="room_type"
                name="room_type"
                value={form.room_type}
                onChange={handleChange}
                required
              >
                <option value="Standard Room">Standard Room</option>
                <option value="Superior Room">Superior Room</option>
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Executive Room">Executive Room</option>
              </select>
            </div>

            <div className={styles.modalField}>
              <label htmlFor="capacity">Guest Capacity</label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.modalField}>
              <label htmlFor="quantity">Room Quantity</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.modalField}>
              <label htmlFor="price_per_night">Price Per Night (R)</label>
              <input
                id="price_per_night"
                name="price_per_night"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price_per_night}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.modalField}>
              <label htmlFor="facilities">Facilities</label>
              <input
                id="facilities"
                name="facilities"
                type="text"
                placeholder="Wi-Fi, TV, air conditioning"
                value={form.facilities}
                onChange={handleChange}
              />
            </div>

            <div className={styles.modalFullField}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Describe the room..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Room image upload */}
            <div className={styles.modalFullField}>
              <label htmlFor="room_image">Room Image</label>
              <input
                id="room_image"
                name="room_image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                required={editingRoomId === null}
              />

              <small>
                {editingRoomId === null
                  ? "Select an image for this room."
                  : "Choose a new image only if you want to replace the current one."}
              </small>

              {imagePreview && (
                <div style={{ marginTop: "12px" }}>
                  <img
                    src={imagePreview}
                    alt="Room image preview"
                    style={{
                      width: "100%",
                      maxWidth: "320px",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.primaryButton}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingRoomId !== null
                  ? "Update Room"
                  : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;
