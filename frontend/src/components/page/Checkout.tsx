
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from"../../../store";
import { createPayment } from "../../redux/PaymentSlice";
import type { Room } from "../../redux/RoomSlice";
import styles from "./Checkout.module.css";

interface CheckoutState {
  booking: {
    id: number;
    [key: string]: unknown;
  };
  room: Room;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guestNumber: number;
  estimatedTotal: number;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector(
    (state: RootState) => state.payments
  );

  const [message, setMessage] = useState("");

  const checkout = location.state as CheckoutState | null;

  if (
    !checkout?.booking?.id ||
    !checkout.room ||
    !checkout.hotelName ||
    !checkout.checkIn ||
    !checkout.checkOut
  ) {
    return (
      <main className={styles.checkoutPage}>
        <section className={styles.card}>
          <h1>Checkout</h1>
          <p>
            Booking details are unavailable. Please select a room
            and confirm your booking first.
          </p>
          <button onClick={() => navigate("/")}>
            Browse Hotels
          </button>
        </section>
      </main>
    );
  }

  const {
    booking,
    room,
    hotelName,
    checkIn,
    checkOut,
    guestNumber,
  } = checkout;

  const nights = Math.round(
    (new Date(`${checkOut}T00:00:00`).getTime() -
      new Date(`${checkIn}T00:00:00`).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const total = nights * Number(room.price_per_night);

  const handlePayNow = async () => {
    setMessage("");

    try {
      const result = await dispatch(
        createPayment({
          booking_id: booking.id,
          payment_method: "Paystack",
        })
      );

      if (!createPayment.fulfilled.match(result)) {
        setMessage(
          String(result.payload ?? "Unable to initialize payment.")
        );
        return;
      }

      const authorizationUrl = result.payload.authorization_url;

      if (!authorizationUrl) {
        setMessage(
          "Payment was created, but the Paystack checkout URL was not returned. Please check the payment backend."
        );
        return;
      }

      const url = new URL(authorizationUrl);

      if (
        url.protocol !== "https:" ||
        !(
          url.hostname === "paystack.com" ||
          url.hostname.endsWith(".paystack.com")
        )
      ) {
        setMessage("The Paystack checkout URL is invalid.");
        return;
      }

      window.location.assign(url.href);
    } catch {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <main className={styles.checkoutPage}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>HAVENSTAY</p>
        <h1>Checkout</h1>
        <p className={styles.subtitle}>
          Review your booking before making payment.
        </p>

        <div className={styles.bookingDetails}>
          <h2>Booking Summary</h2>

          <div className={styles.detailRow}>
            <span>Booking reference</span>
            <strong>#{booking.id}</strong>
          </div>

          <div className={styles.detailRow}>
            <span>Hotel</span>
            <strong>{hotelName}</strong>
          </div>

          <div className={styles.detailRow}>
            <span>Room type</span>
            <strong>{room.room_type}</strong>
          </div>

          <div className={styles.detailRow}>
            <span>Check-in</span>
            <strong>{checkIn}</strong>
          </div>

          <div className={styles.detailRow}>
            <span>Check-out</span>
            <strong>{checkOut}</strong>
          </div>

          <div className={styles.detailRow}>
            <span>Guests</span>
            <strong>{guestNumber}</strong>
          </div>

          <div className={styles.detailRow}>
            <span>Length of stay</span>
            <strong>
              {nights} {nights === 1 ? "night" : "nights"}
            </strong>
          </div>

          <div className={styles.detailRow}>
            <span>Price per night</span>
            <strong>
              R{Number(room.price_per_night).toFixed(2)}
            </strong>
          </div>

          <div className={styles.totalRow}>
            <span>Total to pay</span>
            <strong>R{total.toFixed(2)}</strong>
          </div>

          <p className={styles.pending}>
            Payment pending — your booking has been created.
          </p>

          {(error || message) && (
            <p className={styles.error} role="alert">
              {message || error}
            </p>
          )}

          <button
            className={styles.payButton}
            onClick={handlePayNow}
            disabled={loading || nights <= 0 || total <= 0}
          >
            {loading ? "Preparing Payment..." : "Pay Now"}
          </button>

          <button
            className={styles.backButton}
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Back
          </button>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
