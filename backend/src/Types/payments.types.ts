export type payment_status = "pending" | "successful" | "failed" | "cancelled" | "refunded";

export interface Payment {
    id: number;
    booking_id: number;
    user_id: number;
    amount: string | number;
    currency: string;
    payment_method: string | null;
    status: payment_status;
    transaction_reference: string | null;
    paid_at: Date | null;
    created_at: Date;
    updated_at: Date;
}
export type NewPayment = Pick<
    Payment,
    | "booking_id"
    | "user_id"
    | "amount"
    | "currency"
    | "payment_method"
>;
 
// export type NewPayment = Omit<Payment, "id">;