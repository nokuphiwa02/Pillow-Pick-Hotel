import { Request, Response } from "express";
import * as profileService from "../service/profileService";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const addProfile = async( req: Request, res: Response) => {
    try{
 const newProfile= await profileService.createProfile(req.body);
 res.status(201).json(newProfile);
    }catch(error){
    console.error("Error creating profile:",error);
    res.status(500).json({message: "Error in creating profile "})
    }
};

 export const getProfileById = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const profile = await profileService.findProfileById(userId);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found for this user",
      });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error retrieving profile:", error);

    return res.status(500).json({
      message: "Error retrieving profile",
    });
  }
};

 export const updateProfile = async (req: Request, res:Response) => {
     try{
          
         const id = parseInt(req.params.id as string)
         const updateProfile = await profileService.updateProfileById(id,req.body);
 
         if(!updateProfile){
             return res.status(404).json({message:"Hotel not found"})
         }
         res.status(200).json(updateProfile)
 
     }catch(error){
         console.log("update Profile error:", error); 
       res.status(500).json({message:"error updating Profile"})
     }
 };
 


