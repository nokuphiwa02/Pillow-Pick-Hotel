export type room_type = 'Standard Room' | 'Superior Room' | 'Deluxe Room' | 'Executive Room'

export interface Rooms {
    id: number;
    hotel_id: number;
    room_type: string;
    guest_number: number;
    room_number: number;
    capacity: number;
    quantity: number;
    description: string;
    facilities : string;
    price_per_night: number;
    createdAt_at:Date;
}

export type NewRooms = Omit<Rooms, "id">;