import {Request, Response} from "express";
import * as oAuthoService from "../service/oAuthoService";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    const { authoId, authoProvider, email, name, role } = req.body;
    if (!authoId || !authoProvider || !email || !name || !role) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try{
        const existingUser = await oAuthoService.getOAuthUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({message:"email is already exist"})
    }
    const user = await oAuthoService.createOAuthUser(email, name, "", authoId, authoProvider, role);
    res.status(201).json({message:"user registered successfully"});
   }catch (error) {
    console.error("register error:", error);
    res.status(500).json({message:"Error registering user"});
   }
};