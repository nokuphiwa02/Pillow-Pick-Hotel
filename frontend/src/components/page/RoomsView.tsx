
import React, { useEffect, useState } from "react";

interface Room {
  id: number;
  hotel_id: number;
  room_type:
    | "Standard Room"
    | "Superior Room"
    | "Deluxe Room"
    | "Executive Room";
  capacity: number;
  quantity: number;
  description: string | null;
  price_per_night: number;
  is_available: boolean;
  created_at?: string;
}

interface RoomFormData {
  hotel_id: string;
  room_type: Room["room_type"];
  capacity: string;
  quantity: string;
  description: string;
  price_per_night: string;
}

const API_URL = "http://localhost:5000/api/rooms";

const initialForm: RoomFormData = {
  hotel_id: "",
  room_type: "Standard Room",
  capacity: "2",
  quantity: "1",
  description: "",
  price_per_night: "",
};

export const RoomsView: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState<
    "all" | "available" | "unavailable"
  >("all");

  const [form, setForm] = useState<RoomFormData>(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch rooms.");
      }

      const data: Room[] = await response.json();
      setRooms(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRooms();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hotel_id: Number(form.hotel_id),
          room_type: form.room_type,
          capacity: Number(form.capacity),
          quantity: Number(form.quantity),
          description: form.description.trim(),
          price_per_night: Number(form.price_per_night),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create room.");
      }

      setMessage("Room created successfully!");
      setForm(initialForm);
      setShowForm(false);

      await fetchRooms();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create room."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (filter === "available") return room.is_available;
    if (filter === "unavailable") return !room.is_available;
    return true;
  });

  return (
    <div>
      <h2>🛏️ Rooms Directory</h2>

      <button
        type="button"
        className="btn-primary"
        onClick={() => {
          setShowForm((previous) => !previous);
          setError("");
          setMessage("");
        }}
      >
        {showForm ? "Cancel" : "+ Create Room"}
      </button>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <h3>Create New Room</h3>

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

          <label htmlFor="capacity">Capacity (number of guests)</label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            max="2"
            value={form.capacity}
            onChange={handleChange}
            required
          />

          <label htmlFor="quantity">Quantity of Rooms</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            required
          />

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

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the room..."
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Room"}
          </button>
        </form>
      )}

      <div
        style={{
          margin: "1.5rem 0",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn-primary"
          onClick={() => setFilter("all")}
        >
          All Rooms
        </button>

        <button
          className="btn-primary"
          onClick={() => setFilter("available")}
        >
          Available
        </button>

        <button
          className="btn-primary"
          onClick={() => setFilter("unavailable")}
        >
          Unavailable
        </button>
      </div>

      {loading && rooms.length === 0 ? (
        <p>Loading rooms...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Room ID</th>
              <th>Hotel ID</th>
              <th>Room Type</th>
              <th>Capacity</th>
              <th>Quantity</th>
              <th>Price Per Night</th>
              <th>Availability</th>
            </tr>
          </thead>

          <tbody>
            {filteredRooms.map((room) => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.hotel_id}</td>
                <td>{room.room_type}</td>
                <td>{room.capacity}</td>
                <td>{room.quantity}</td>
                <td>
                  R{Number(room.price_per_night).toFixed(2)}
                </td>
                <td>
                  <span
                    className={`badge ${
                      room.is_available ? "available" : "unavailable"
                    }`}
                  >
                    {room.is_available ? "Available" : "Unavailable"}
                  </span>
                </td>
              </tr>
            ))}

            {!loading && filteredRooms.length === 0 && (
              <tr>
                <td colSpan={7}>No rooms found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
