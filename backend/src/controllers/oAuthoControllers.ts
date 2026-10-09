import { Request, Response } from "express";
import * as oAuthoService from "../service/oAuthoService";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req: Request, res: Response) => {
    const { authoId, authoProvider, email, name, role, password } = req.body;
    if (!authoId || !authoProvider || !email || !name || !role || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const existingUser = await oAuthoService.getOAuthUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "email is already exist" })
        }
        const user = await oAuthoService.createOAuthUser(email, name, password, authoId, authoProvider, role);
        res.status(201).json({ message: "user registered successfully" });
    } catch (error) {
        console.error("register error:", error);
        res.status(500).json({ message: "Error registering user" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = await oAuthoService.getOAuthUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "invalid email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const payload = { id: user.id, email: user.email, password: user.password };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });

        console.log(`user & {email} logged in successfully`);
        res.status(200).json({ message: "Login Successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error loging in" });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        if (req.user!.role !== 'admin') {
            return res.status(403).json({ message: "Only Admin can get all users" })
        }

        const users = await oAuthoService.findAllusers();
        return res.status(200).json(users)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error retrieving user" })
    }
};

export const getUserById = async(req: Request, res:Response) => {
    try{
        if(req.user!.role !== 'guest'){
        return res.status(403).json({ message: "Only guest can get users by Id" })
        }
       const id = parseInt(req.params.id as string);
       const user = await oAuthoService.findUserById(id)

       if(!user){
        return res.status(404).json({message:"user not found"})
       }
       return res.status(200).json(user)

    }catch(error){
        console.log(error)
     res.status(500).json({message:"error retrieving user"})
    }
};

export const updateUserProfile = async (req: Request, res:Response) => {
    try{
        if(req.user!.role !== 'guest'){
        return res.status(403).json({ message: "Only guest can update profile" })
        }
        const id = parseInt(req.params.id as string)
        const updateUser = await oAuthoService.updateUserById(id,req.body);

        if(!updateUser){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json(updateUser)

    }catch(error){
      res.status(500).json({message:"error updating profile"})
    }
};

export const deleteUserProfile = async(req: Request,res:Response) => {
    try{
          if (req.user!.role !== 'admin') {
            return res.status(403).json({ message: "Only Admin can delete user" })
        }
        const id =parseInt(req.params.id as string)
        const deleteUser = await oAuthoService.deleteUserById(id)

        if(!deleteUser){
            return res.status(404).json({message:"user not found"});
        }
        res.status(200).json({message:"User Deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Error deleting user"})
    }
};
