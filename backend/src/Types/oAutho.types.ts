
export type userRole = "admin" | "guest";

export interface OAuthUser {
  id: number;
  authoId: string | null;
  authoProvider: string | null;
  password: string | null;
  email: string;
  name: string;
  role: userRole;
  phone: number | null;
  createdAt: Date;
}

export type NewOAuthUser = Omit<OAuthUser, "id" | "createdAt">;
