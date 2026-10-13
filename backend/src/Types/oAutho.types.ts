export type userRole = "admin" | "guest";

export interface OAuthUser {
  id: number;
  authoId: number;
  authoProvider: string;
  password: string;
  email: string;
  name: string;
  role: userRole;
  phone: number;
  createdAt: Date;
}

export type NewOAuthUser = Omit<OAuthUser, "id">;
