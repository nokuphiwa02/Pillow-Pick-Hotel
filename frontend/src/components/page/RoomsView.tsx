
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store";
import styles from "../page/RoomsView.module.css";
import { fetchRooms,createRoom,updateRoomById,deleteRoomById} from "../../redux/RoomSlice";
import type { Room } from "../../redux/RoomSlice";
import RoomModal, { type RoomFormValues } from "../RoomModal/RoomModal";

const initialForm: RoomFormValues = {
  hotel_id: "",
  room_type: "Standard Room",
  capacity: "2",
  quantity: "1",
  description: "",
  facilities: "",
  price_per_night: "",
};

export const RoomsView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { rooms, loading, error } = useSelector(
    (state: RootState) => state.rooms,
  );

  const [filter, setFilter] = useState<
    "all" | "available" | "unavailable"
  >("all");

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<RoomFormValues>(initialForm);
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const openCreateModal = () => {
    setForm({ ...initialForm });
    setEditingRoomId(null);
    setMessage("");
    setShowModal(true);
  };

  const openEditModal = (room: Room) => {
    setForm({
      hotel_id: String(room.hotel_id),
      room_type: room.room_type,
      capacity: String(room.capacity),
      quantity: String(room.quantity),
      description: room.description ?? "",
      facilities: room.facilities ?? "",
      price_per_night: String(room.price_per_night),
    });

    setEditingRoomId(room.id);
    setMessage("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRoomId(null);
    setForm({ ...initialForm });
  };

 

const handleSubmit = async (
  values: RoomFormValues,
  imageFile: File | null,
) => {
  setMessage("");

  try {
    const formData = new FormData();

    formData.append("hotel_id", values.hotel_id);
    formData.append("room_type", values.room_type);
    formData.append("capacity", values.capacity);
    formData.append("quantity", values.quantity);
    formData.append("description", values.description);
    formData.append("facilities", values.facilities);
    formData.append("price_per_night", values.price_per_night);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (editingRoomId !== null) {
      await dispatch(
        updateRoomById({
          id: editingRoomId,
          roomData: formData,
        }),
      ).unwrap();

      setMessage("Room updated successfully!");
    } else {
      if (!imageFile) {
        setMessage("Please select a room image.");
        return;
      }

      await dispatch(createRoom(formData)).unwrap();

      setMessage("Room created successfully!");
    }

    closeModal();
    await dispatch(fetchRooms()).unwrap();
  } catch (err) {
    console.error("Failed to save room:", err);

    setMessage(
      typeof err === "string"
        ? err
        : "Failed to save room. Please try again.",
    );
  }
};

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?",
    );

    if (!confirmed) return;

    setMessage("");

    try {
      await dispatch(deleteRoomById(id)).unwrap();

      if (editingRoomId === id) {
        closeModal();
      }

      setMessage("Room deleted successfully!");
      await dispatch(fetchRooms()).unwrap();
    } catch (err) {
      console.error("Failed to delete room:", err);

      setMessage(
        typeof err === "string"
          ? err
          : "Failed to delete room. Please try again.",
      );
    }
  };

  const isRoomAvailable = (room: Room): boolean => {
    if (
      "is_available" in room &&
      typeof room.is_available === "boolean"
    ) {
      return room.is_available;
    }

    return Number(room.quantity) > 0;
  };

  const filteredRooms = rooms.filter((room) => {
    const available = isRoomAvailable(room);

    if (filter === "available") return available;
    if (filter === "unavailable") return !available;

    return true;
  });

  return (
    <div className={styles.roomsContainer}>
      <div className={styles.roomsHeader}>
        <div>
          <h2>🛏️ Rooms Directory</h2>
          <p>View and manage your existing hotel rooms.</p>
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={openCreateModal}
        >
          + Create Room
        </button>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      {error && (
        <p className={styles.error}>
          {typeof error === "string" ? error : "Failed to load rooms."}
        </p>
      )}

      <div className={styles.filterButtons}>
        <button
          type="button"
          className={filter === "all" ? styles.activeFilter : ""}
          onClick={() => setFilter("all")}
        >
          All Rooms
        </button>

        <button
          type="button"
          className={filter === "available" ? styles.activeFilter : ""}
          onClick={() => setFilter("available")}
        >
          Available
        </button>

        <button
          type="button"
          className={filter === "unavailable" ? styles.activeFilter : ""}
          onClick={() => setFilter("unavailable")}
        >
          Unavailable
        </button>
      </div>

      {loading && rooms.length === 0 ? (
        <p>Loading rooms...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Hotel ID</th>
                <th>Room Type</th>
                <th>Capacity</th>
                <th>Quantity</th>
                <th>Description</th>
                <th>Facilities</th>
                <th>Price Per Night</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRooms.map((room) => {
                const available = isRoomAvailable(room);

                return (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td>{room.hotel_id}</td>
                    <td>{room.room_type}</td>
                    <td>{room.capacity}</td>
                    <td>{room.quantity}</td>
                    <td>{room.description || "—"}</td>
                    <td>{room.facilities || "—"}</td>
                    <td>
                      R{Number(room.price_per_night).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={
                          available
                            ? styles.available
                            : styles.unavailable
                        }
                      >
                        {available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.roomActions}>
                        <button
                          type="button"
                          className={styles.editButton}
                          onClick={() => openEditModal(room)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => handleDelete(room.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredRooms.length === 0 && (
                <tr>
                  <td colSpan={10}>No rooms found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <RoomModal
          initialValues={form}
          editingRoomId={editingRoomId}
          loading={loading}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default RoomsView;