export interface Hotels {
id: number;
hotel_name: string;
address:string;
city:string;
rating: number;
description: string;
createdAt_at:Date;
}

export type NewHotels = Omit<Hotels, "id">;