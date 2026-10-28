export interface Profile{
    id:number;
    user_id: number;
    name: string;
    email: string;
    password: string;
    phone: number;
    profile_picture: string;
    address: string;
    createdAt: Date;
}

export type NewProfile = Omit<Profile , "id">