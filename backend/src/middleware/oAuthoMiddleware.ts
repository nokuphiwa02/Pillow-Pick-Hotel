import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getOAuthUserByEmail } from "../service/oAuthoService";
import { OAuthUser } from "../Types/oAutho.types";

interface JwtPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const user: OAuthUser | null = await getOAuthUserByEmail(
      decoded.email
    );

    if (!user) {
      return res.status(401).json({
        message: "Not authorized, user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);

    return res.status(401).json({
      message: "Not authorized, token verification or user lookup failed",
    });
  }
};