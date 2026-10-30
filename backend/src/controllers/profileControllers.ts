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

 export const getProfileById = async (req: Request, res: Response) => {
  try {
    const user_id = Number(req.params.id);

    if (!Number.isInteger(user_id) || user_id <= 0) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const profile = await profileService.findProfileById(user_id);

    console.log("Requested user ID:", user_id);
    console.log("Profile found:", profile);

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

 export const updateProfile = async (req: Request, res: Response) => {
  console.log("UPDATE PROFILE ROUTE HIT:", req.params.id);

  try {
    const user_id = Number(req.params.id);

    // Validate user ID
    if (!Number.isInteger(user_id) || user_id <= 0) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // Update the profile using the user ID
    const updatedProfile = await profileService.updateProfileById(
      user_id,
      req.body
    );

    // Check whether a profile was found
    if (!updatedProfile) {
      return res.status(404).json({
        message: "Profile not found for this user",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Error updating profile",
    });
  }
};
 


