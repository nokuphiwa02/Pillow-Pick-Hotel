
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./PaymentSuccess.module.css";

interface VerifiedPaymentResponse {
  success: boolean;
  message: string;
  payment?: {
    id: number;
    status: string;
  };
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(
    "Verifying your payment..."
  );

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      // Paystack redirects with a transaction reference.
      const reference = searchParams.get("reference");

      if (!reference) {
        setMessage("Payment reference is missing.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("Token");

        if (!token) {
          setMessage(
            "Please log in again to verify your payment."
          );
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/payments/verify?reference=${encodeURIComponent(reference)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          (await response.json()) as VerifiedPaymentResponse;

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to verify your payment."
          );
        }

        if (cancelled) return;

        if (data.success && data.payment?.status === "successful") {
          setSuccess(true);
          setMessage(
            "Your payment has been received successfully. Thank you for booking with HavenStay!"
          );
        } else {
          setSuccess(false);
          setMessage(
            data.message || "Your payment is not yet confirmed."
          );
        }
      } catch (error) {
        if (cancelled) return;

        setSuccess(false);
        setMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong while verifying your payment."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <main className={styles.successPage}>
      <section className={styles.successCard}>
        {loading ? (
          <div className={styles.statusIcon}>...</div>
        ) : success ? (
          <div className={styles.successIcon}>✓</div>
        ) : (
          <div className={styles.pendingIcon}>!</div>
        )}

        <p className={styles.brand}>HAVENSTAY</p>

        <h1>
          {loading
            ? "Verifying Payment"
            : success
              ? "Payment Successful!"
              : "Payment Not Confirmed"}
        </h1>

        <p className={styles.message}>{message}</p>

        {!loading && (
          <button
            type="button"
            className={styles.homeButton}
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        )}
      </section>
    </main>
  );
};

export default PaymentSuccess;
