export interface Favourites {
    id: number;
    user_id: number;
    hotel_id: number;
    created_at: Date;
}

export type NewFavourites = Omit<Favourites, "id">;