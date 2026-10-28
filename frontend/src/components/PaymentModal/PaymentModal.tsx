
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store";
import { createPayment } from "../../redux/PaymentSlice";
import styles from "./PaymentModal.module.css";

interface PaymentModalProps {
  bookingId: number;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  bookingId,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector(
    (state: RootState) => state.payments
  );

  if (!isOpen) {
    return null;
  }

  const handlePayNow = async () => {
    try {
      const resultAction = await dispatch(
        createPayment({
          booking_id: bookingId,
          payment_method: "Paystack",
        })
      );

      if (createPayment.fulfilled.match(resultAction)) {
        const responseData = resultAction.payload;

        if (responseData.authorization_url) {
          window.location.href = responseData.authorization_url;
        } else {
          alert(
            "Payment was created, but the Paystack authorization URL was not found."
          );
        }
      }
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Complete Payment for Booking #{bookingId}</h3>

        <p>
          You will be redirected to Paystack to complete your payment.
        </p>

        {error && (
          <p className={styles.errorMessage}>
            {typeof error === "string"
              ? error
              : "Something went wrong while processing your payment."}
          </p>
        )}

        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={handlePayNow}
            disabled={loading}
            className={styles.payButton}
          >
            {loading ? "Processing..." : "Pay Now (Paystack)"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;