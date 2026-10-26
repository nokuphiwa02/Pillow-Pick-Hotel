
import { Request, Response } from "express";
import * as roomService from "../service/roomService";

export const addRoom = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can add a room",
      });
    }

     console.log("Uploaded file:", req.file);
    console.log("Uploaded image path:", req.file?.path);
    
    const image = req.file?.path ? [req.file.path] : [];

    const newRoom = await roomService.createRooms({
      ...req.body,
      hotel_id: Number(req.body.hotel_id),
      capacity: Number(req.body.capacity),
      quantity: Number(req.body.quantity),
      price_per_night: Number(req.body.price_per_night),
      image,
    });

    return res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({
      message: "Error creating room",
    });
  }
};

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await roomService.findAllRooms();
    return res.status(200).json(rooms);
  } catch (error) {
    console.error("Error retrieving rooms:", error);
    return res.status(500).json({
      message: "Error retrieving rooms",
    });
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const room = await roomService.findRoomById(id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json(room);
  } catch (error) {
    console.error("Error retrieving room:", error);
    return res.status(500).json({
      message: "Error retrieving room",
    });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update a room",
      });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const roomData = {
      ...req.body,
      hotel_id:
        req.body.hotel_id !== undefined
          ? Number(req.body.hotel_id)
          : undefined,
      capacity:
        req.body.capacity !== undefined
          ? Number(req.body.capacity)
          : undefined,
      quantity:
        req.body.quantity !== undefined
          ? Number(req.body.quantity)
          : undefined,
      price_per_night:
        req.body.price_per_night !== undefined
          ? Number(req.body.price_per_night)
          : undefined,
      image: req.file?.path ? [req.file.path] : undefined,
    };

    const room = await roomService.updateRoomById(id, roomData);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json(room);
  } catch (error) {
    console.error("Error updating room:", error);
    return res.status(500).json({
      message: "Error updating room",
    });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete a room",
      });
    }

    const id = Number(req.params.id);
    const room = await roomService.deleteRoomById(id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    return res.status(500).json({
      message: "Error deleting room",
    });
  }
};
