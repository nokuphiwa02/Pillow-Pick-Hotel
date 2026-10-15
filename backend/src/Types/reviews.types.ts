export interface Reviews{
    id: number;
    hotel_id:number;
    user_id:number;
    rating:number;
    comment:string;
    created_at: Date;
}

export type NewReviews = Omit<Reviews, "id">