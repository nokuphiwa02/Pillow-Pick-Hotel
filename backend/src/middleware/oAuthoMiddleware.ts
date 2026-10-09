import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getOAuthUserByEmail } from '../service/oAuthoService';
import { OAuthUser } from '../Types/oAutho.types';

interface JwtPayload {
    userId: number;
    email: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
            
            const user: OAuthUser | null = await getOAuthUserByEmail(decoded.email);

            if (!user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            req.user = user;
            return next();
            
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

   
    return res.status(401).json({ message: "Not authorized, no token" });
};
