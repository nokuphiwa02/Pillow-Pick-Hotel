import { Request,Response } from "express";
import * as roomService from "../service/roomService"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const addRoom = async (req: Request, res: Response) => {
    try{
       if(req.user!.role !== 'admin'){
        return res.status(403).json({message:"only admin can add hotel"})
    }
    const newRoom = await roomService.createRooms(req.body);
    res.status(201).json(newRoom);
    }catch(error){
        console.error("Error creating rooms:", error);
        res.status(500).json({message: "Error in creating room"});
    }
};

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await roomService.findAllRooms();
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error retrieving rooms:", error);
    res.status(500).json({ message: "Error retrieving rooms" });
  }
};

export const getRoomById = async (req: Request, res: Response) => {
try{
    const id = parseInt(req.params.id as string);

    const room = await roomService.findRoomById(id)

    if (!room){
        return res.status(404).json({message:"room not found"})
    }
    return res.status(200).json(room)
}catch (error){
res.status(500).json({message:"error retrieving room"})
}
};

export const updateRoom = async (req: Request, res:Response) => {
    try{
         if (req.user!.role !== 'admin') {
            return res.status(403).json({ message: "Only Admin can update Room" })
        }
        const id = parseInt(req.params.id as string)
        const room = await roomService.updateRoomById(id,req.body);

        if(!room){
            return res.status(404).json({message:"Room not found"})
        }
        res.status(200).json(room)

    }catch(error){
        console.log("update Room error:", error); 
      res.status(500).json({message:"error updating Room"})
    }
};

export const deleteRoom = async(req: Request,res:Response) => {
    try{
          if (req.user!.role !== 'admin') {
            return res.status(403).json({ message: "Only Admin can delete Room" })
        }
        const id =parseInt(req.params.id as string)
        const room = await roomService.deleteRoomById(id)

        if(!room){
            return res.status(404).json({message:"Room not found"});
        }
        res.status(200).json({message:"Room Deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Error deleting Room"})
    }
};
