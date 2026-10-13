import { Request,Response } from "express";
import * as hotelService from "../service/hotelService";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const addHotel = async (req: Request, res: Response) => {
  try {
    if(req.user!.role !== 'admin'){
        return res.status(403).json({message:"only admin can add hotel"})
    }
    const newHotel = await hotelService.createHotels(req.body);
    res.status(201).json(newHotel);
  } catch (error) {
   
    console.error("Hotel Creation error:", error);

    res.status(500).json({ message: "Error in creating hotel" });
  }
};

export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await hotelService.findAllHotels();
    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error retrieving hotels:", error);
    res.status(500).json({ message: "Error retrieving hotels" });
  }
};

export const getHotelById = async (req: Request, res: Response) => {
try{
    const id = parseInt(req.params.id as string);

    const hotels = await hotelService.findHotelById(id)

    if (!hotels){
        return res.status(404).json({message:"hotels not found"})
    }
    return res.status(200).json(hotels)
}catch (error){
res.status(500).json({message:"error retrieving hotels"})
}
};

export const updateHotel = async (req: Request, res:Response) => {
    try{
         if (req.user!.role !== 'admin') {
            return res.status(403).json({ message: "Only Admin can update hotel" })
        }
        const id = parseInt(req.params.id as string)
        const updateHotel = await hotelService.updateHotelById(id,req.body);

        if(!updateHotel){
            return res.status(404).json({message:"Hotel not found"})
        }
        res.status(200).json(updateHotel)

    }catch(error){
        console.log("update hotels error:", error); 
      res.status(500).json({message:"error updating hotel"})
    }
};

export const deleteHotel = async(req: Request,res:Response) => {
    try{
          if (req.user!.role !== 'admin') {
            return res.status(403).json({ message: "Only Admin can delete hotel" })
        }
        const id =parseInt(req.params.id as string)
        const deleteHotel = await hotelService.deleteHotelById(id)

        if(!deleteHotel){
            return res.status(404).json({message:"hotel not found"});
        }
        res.status(200).json({message:"hotel Deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Error deleting hotel"})
    }
};




