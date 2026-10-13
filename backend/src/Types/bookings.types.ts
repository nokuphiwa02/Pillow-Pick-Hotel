export type booking_status = 'Pending' | 'Cancelled' | 'Approve'

export interface Bookings {
    id: number;
    user_id: number;
    room_id: number;
    check_in: Date;
    check_out: Date;
    guest_number:number;
    total_price: number;
    booking_status: string;
    createdAt_at:Date;
}

export type NewBookings = Omit<Bookings, "id">;