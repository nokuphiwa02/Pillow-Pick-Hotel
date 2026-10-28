
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../store";
import { createBooking } from "../../redux/BookingSlice";
import type { Room } from "../../redux/RoomSlice";
import styles from "./BookingModal.module.css";

interface BookingModalProps {
  room: Room;
  hotelName: string;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  hotelName,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading: bookingLoading, error: bookingError } =
    useSelector((state: RootState) => state.bookings);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestNumber, setGuestNumber] = useState(1);
  const [message, setMessage] = useState("");

  const loading = bookingLoading;

  const today = new Date().toLocaleDateString("en-CA");

  const nights =
    checkIn && checkOut
      ? Math.round(
          (new Date(`${checkOut}T00:00:00`).getTime() -
            new Date(`${checkIn}T00:00:00`).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const estimatedTotal =
    nights > 0
      ? nights * Number(room.price_per_night)
      : 0;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setMessage("");

    if (!checkIn || !checkOut || nights <= 0) {
      setMessage(
        "Please select valid check-in and check-out dates."
      );
      return;
    }

    if (checkIn < today) {
      setMessage("Check-in date cannot be in the past.");
      return;
    }

    if (
      guestNumber < 1 ||
      guestNumber > Number(room.capacity)
    ) {
      setMessage(
        `This room accommodates a maximum of ${room.capacity} guest(s).`
      );
      return;
    }

    if (Number(room.quantity) < 1) {
      setMessage("This room is currently unavailable.");
      return;
    }

    try {
      const bookingResult = await dispatch(
        createBooking({
          room_id: room.id,
          check_in: checkIn,
          check_out: checkOut,
          guest_number: guestNumber,
        })
      );

      if (!createBooking.fulfilled.match(bookingResult)) {
        setMessage(
          String(
            bookingResult.payload ??
              "Failed to create your booking. Please try again."
          )
        );
        return;
      }

      const booking = bookingResult.payload;

      // Close the modal and navigate to Checkout.
      onClose();

      navigate("/guest/hotel/:id/checkout", {
        state: {
          booking,
          room,
          hotelName,
          checkIn,
          checkOut,
          guestNumber,
          estimatedTotal,
        },
      });
    } catch {
      setMessage(
        "Something went wrong while creating your booking. Please try again."
      );
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          onClose();
        }
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close booking form"
          disabled={loading}
        >
          &times;
        </button>

        <span className={styles.eyebrow}>HAVENSTAY</span>

        <h2 id="booking-title">Book your stay</h2>

        <p className={styles.hotelName}>{hotelName}</p>

        <div className={styles.roomSummary}>
          <div>
            <span>Room type</span>
            <strong>{room.room_type}</strong>
          </div>

          <div>
            <span>Guests allowed</span>
            <strong>{room.capacity}</strong>
          </div>

          <div>
            <span>Price per night</span>
            <strong>
              R{Number(room.price_per_night).toFixed(2)}
            </strong>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <label htmlFor="checkIn">Check-in date</label>

          <input
            id="checkIn"
            type="date"
            min={today}
            value={checkIn}
            onChange={(event) => {
              setCheckIn(event.target.value);

              if (
                checkOut &&
                event.target.value >= checkOut
              ) {
                setCheckOut("");
              }
            }}
            required
            disabled={loading}
          />

          <label htmlFor="checkOut">Check-out date</label>

          <input
            id="checkOut"
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(event) =>
              setCheckOut(event.target.value)
            }
            required
            disabled={loading || !checkIn}
          />

          <label htmlFor="guestNumber">
            Number of guests
          </label>

          <input
            id="guestNumber"
            type="number"
            min={1}
            max={room.capacity}
            value={guestNumber}
            onChange={(event) =>
              setGuestNumber(Number(event.target.value))
            }
            required
            disabled={loading}
          />

          {nights > 0 && (
            <div className={styles.total}>
              <span>
                Estimated total ({nights}{" "}
                {nights === 1 ? "night" : "nights"})
              </span>

              <strong>
                R{estimatedTotal.toFixed(2)}
              </strong>
            </div>
          )}

          {bookingError && (
            <p className={styles.error} role="alert">
              {String(bookingError)}
            </p>
          )}

          {message && (
            <p className={styles.error} role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading
              ? "Creating Booking..."
              : "Confirm Booking"}
          </button>

          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </form>
      </section>
    </div>
  );
};

export default BookingModal;
