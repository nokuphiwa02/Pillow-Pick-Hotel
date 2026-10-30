
import { query } from "../config/database";
import { Payment, NewPayment } from "../Types/payments.types";

// Paystack response types
interface PaystackInitializeResponse {
    status: boolean;
    message: string;
    data?: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}


interface PaystackVerifyResponse {
    status: boolean;
    message: string;
    data?: {
        status: string;
        reference: string;
        amount: number;
        currency: string;
    };
}


// Create the payment status type and payments table
export const createPaymentTables = async (): Promise<void> => {
    try {
        await query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_type
                    WHERE typname = 'payment_status'
                ) THEN
                    CREATE TYPE payment_status AS ENUM (
                        'pending',
                        'successful',
                        'failed',
                        'cancelled',
                        'refunded'
                    );
                END IF;
            END $$;
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                booking_id INT NOT NULL
                    REFERENCES bookings(id) ON DELETE CASCADE,
                user_id INT NOT NULL
                    REFERENCES oauth_users(id) ON DELETE CASCADE,
                amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
                currency VARCHAR(3) NOT NULL DEFAULT 'ZAR',
                payment_method VARCHAR(50),
                status payment_status NOT NULL DEFAULT 'pending',
                transaction_reference VARCHAR(255) UNIQUE,
                paid_at TIMESTAMP,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Payments table created successfully");
    } catch (error) {
        console.error("Error creating payments table:", error);
        throw error;
    }
};

// Create a pending payment record
export const createPayment = async (
    payment: NewPayment
): Promise<Payment> => {
    const {
        booking_id,
        user_id,
        amount,
        currency,
        payment_method
    } = payment;

    const result = await query(
        `INSERT INTO payments (
            booking_id,
            user_id,
            amount,
            currency,
            payment_method,
            status
        )
        VALUES ($1, $2, $3, $4, $5, 'pending')
        RETURNING *`,
        [
            booking_id,
            user_id,
            amount,
            currency,
            payment_method
        ]
    );

    return result.rows[0] as Payment;
};

// Initialize a Paystack transaction
export const initializePaystackPayment = async (
    paymentId: number,
    bookingId: number,
    amount: number,
    email: string
): Promise<{
    authorization_url: string;
    reference: string;
}> => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
        throw new Error(
            "PAYSTACK_SECRET_KEY is missing from .env"
        );
    }

    if (!email || !Number.isFinite(amount) || amount <= 0) {
        throw new Error("Valid email and amount are required");
    }

    const response = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${secretKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            email,
            amount: Math.round(amount * 100),
            currency: "ZAR",
            callback_url: `${process.env.FRONTEND_URL}/payment-callback`,
            metadata: {
                payment_id: paymentId,
                booking_id: bookingId
            }
        })
        }
    );

    const result =
        await response.json() as PaystackInitializeResponse;

    if (
        !response.ok ||
        !result.status ||
        !result.data?.authorization_url ||
        !result.data?.reference
    ) {
        console.error(
            "Paystack initialization failed:",
            result.message
        );

        throw new Error(
            result.message || "Paystack initialization failed"
        );
    }

    return {
        authorization_url: result.data.authorization_url,
        reference: result.data.reference
    };
};

// Get all payments
export const getAllPayments = async (): Promise<Payment[]> => {
    const result = await query(
        `SELECT * FROM payments ORDER BY created_at DESC`
    );

    return result.rows as Payment[];
};

// Get payment by ID
export const getPaymentById = async (
    id: number
): Promise<Payment | null> => {
    const result = await query(
        `SELECT * FROM payments WHERE id = $1`,
        [id]
    );

    return (result.rows[0] as Payment) ?? null;
};

// Get payments belonging to a user
export const getPaymentsByUserId = async (
    userId: number
): Promise<Payment[]> => {
    const result = await query(
        `SELECT * FROM payments
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows as Payment[];
};

// Get payments for a particular booking
export const getPaymentsByBookingId = async (
    bookingId: number
): Promise<Payment[]> => {
    const result = await query(
        `SELECT * FROM payments
         WHERE booking_id = $1
         ORDER BY created_at DESC`,
        [bookingId]
    );

    return result.rows as Payment[];
};

// Find a payment using its Paystack transaction reference
export const getPaymentByReference = async (
    reference: string
): Promise<Payment | null> => {
    const result = await query(
        `SELECT * FROM payments
         WHERE transaction_reference = $1`,
        [reference]
    );

    return (result.rows[0] as Payment) ?? null;
        };
        // Confirm a booking after Paystack verifies successful payment
        const approveBookingAfterSuccessfulPayment = async (
        bookingId: number
        ): Promise<void> => {
        const result = await query(
            `UPDATE bookings
            SET booking_status = 'Approve'
            WHERE id = $1
            RETURNING id`,
            [bookingId]
        );

        if (result.rows.length === 0) {
            throw new Error(
            `Booking ${bookingId} was not found.`
            );
        }
        };



export const verifyPaystackPayment = async (
    reference: string
): Promise<Payment> => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
        throw new Error("PAYSTACK_SECRET_KEY is missing from .env");
    }

    const payment = await getPaymentByReference(reference);

    if (!payment) {
        throw new Error("Payment reference not found.");
    }

    // Avoid changing a payment that has already succeeded.
   if (payment.status === "successful") {
  await approveBookingAfterSuccessfulPayment(
    payment.booking_id
  );

  return payment;
}

    const response = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${secretKey}`,
                "Content-Type": "application/json"
            }
        }
    );

    const result =
        await response.json() as PaystackVerifyResponse;

    if (!response.ok || !result.status || !result.data) {
        throw new Error(
            result.message || "Unable to verify payment with Paystack."
        );
    }

    const transaction = result.data;

    // Confirm this is the exact transaction we initialized.
    if (transaction.reference !== payment.transaction_reference) {
        throw new Error("Payment reference does not match.");
    }

    // Paystack returns the amount in the currency's minor unit.
    const expectedAmount = Math.round(Number(payment.amount) * 100);

    if (
        !Number.isFinite(expectedAmount) ||
        transaction.amount !== expectedAmount ||
        transaction.currency !== payment.currency
    ) {
        throw new Error("Payment amount or currency does not match.");
    }

    // Only mark successful after Paystack confirms success.
    if (transaction.status === "success") {
  const updatedPayment = await updatePaymentStatus(
    payment.id,
    "successful"
  );

  if (!updatedPayment) {
    throw new Error("Could not update payment status.");
  }

  // Update the booking only after Paystack confirms payment.
  await approveBookingAfterSuccessfulPayment(
    payment.booking_id
  );

  return updatedPayment;
}

    if (
        transaction.status === "failed" ||
        transaction.status === "abandoned"
    ) {
        const updatedPayment = await updatePaymentStatus(
            payment.id,
            transaction.status === "abandoned"
                ? "cancelled"
                : "failed"
        );

        if (!updatedPayment) {
            throw new Error("Could not update payment status.");
        }

        return updatedPayment;
    }

    // Keep pending/ongoing transactions pending.
    return payment;
};


// Save the Paystack reference returned during initialization
export const updatePaymentReference = async (
    paymentId: number,
    reference: string
): Promise<Payment | null> => {
    const result = await query(
        `UPDATE payments
         SET transaction_reference = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [reference, paymentId]
    );

    return (result.rows[0] as Payment) ?? null;
};

// Update payment status after verification

export const updatePaymentStatus = async (
    paymentId: number,
    status: Payment["status"]
): Promise<Payment | null> => {
    const result = await query(
        `UPDATE payments
         SET status = $1::payment_status,
             paid_at = CASE
                 WHEN $1::text = 'successful'
                 THEN CURRENT_TIMESTAMP
                 ELSE paid_at
             END,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, paymentId]
    );

    return (result.rows[0] as Payment) ?? null;
};


// Delete a payment record
export const deletePayment = async (
    id: number
): Promise<Payment | null> => {
    const result = await query(
        `DELETE FROM payments
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return (result.rows[0] as Payment) ?? null;
};
