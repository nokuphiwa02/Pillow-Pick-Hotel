export type userRole = "admin" | "guest";

export interface OAuthUser {
  id: string;
  authoId: number;
  authoProvider: string;
  email: string;
  name: string;
  role: userRole;
  createdAt: Date;
}

export type NewOAuthUser = Omit<OAuthUser, "id">;
