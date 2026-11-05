
export interface Profile {
  id: number;
  user_id: number;
  name: string;
  email: string;
  password: string | null;
  phone: string | null;
  profile_picture: string;
  address: string;
  created_at: Date;
}

export type NewProfile = Omit<Profile, "id" | "created_at">;
