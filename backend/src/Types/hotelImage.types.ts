export interface hotelImage{
    id: number;
    hotel_id:number;
    is_primary:boolean;
    img_url: string;
    created_at: Date;
}

export type NewHotelImage = Omit<hotelImage, "id">;