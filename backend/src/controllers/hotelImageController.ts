
import { Request, Response } from "express";
import * as hotelImageService from "../service/hotelImageService";
import type { NewHotelImage } from "../Types/hotelImage.types";

export const addHotelImage = async (req: Request, res: Response) => {
  try {
    const uploadFiles = req.files as Express.Multer.File[] | undefined;

    const hotelId = Number(req.body.hotel_id);

    if (!Number.isInteger(hotelId) || hotelId <= 0) {
      return res.status(400).json({
        message: "A valid hotel_id is required",
      });
    }

    if (!uploadFiles || uploadFiles.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one image using the pictures field",
      });
    }

    const isPrimary = req.body.is_primary === "true";

    const createdImages = await Promise.all(
      uploadFiles.map((file, index) => {
        const imageData: NewHotelImage = {
          hotel_id: hotelId,
          is_primary: isPrimary && index === 0,
          img_url: file.path.replace(/\\/g, "/"),
          created_at: new Date(),
        };

        return hotelImageService.createhotelImage(imageData);
      })
    );

    return res.status(201).json(createdImages);
  } catch (error) {
    console.error("Hotel image creation error:", error);

    return res.status(500).json({
      message: "Error creating hotel images",
    });
  }
};

export const getAllImage = async (_req: Request, res: Response) => {
  try {
    const images = await hotelImageService.findAllhotelImage();
    return res.status(200).json(images);
  } catch (error) {
    console.error("Error retrieving hotel images:", error);

    return res.status(500).json({
      message: "Error retrieving hotel images",
    });
  }
};

export const getHotelImageById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid image ID" });
    }

    const image = await hotelImageService.findhotelImageById(id);

    if (!image) {
      return res.status(404).json({ message: "Hotel image not found" });
    }

    return res.status(200).json(image);
  } catch (error) {
    console.error("Error retrieving hotel image:", error);

    return res.status(500).json({
      message: "Error retrieving hotel image",
    });
  }
};

export const updateHotelImage = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only Admin can update hotel images",
      });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid image ID" });
    }

    const updatedImage = await hotelImageService.updateHotelImageById(
      id,
      req.body
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Hotel image not found" });
    }

    return res.status(200).json(updatedImage);
  } catch (error) {
    console.error("Hotel image update error:", error);

    return res.status(500).json({
      message: "Error updating hotel image",
    });
  }
};

export const deleteHotelImage = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only Admin can delete hotel images",
      });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid image ID" });
    }

    const deletedImage = await hotelImageService.deletehotelImageById(id);

    if (!deletedImage) {
      return res.status(404).json({ message: "Hotel image not found" });
    }

    return res.status(200).json({
      message: "Hotel image deleted successfully",
    });
  } catch (error) {
    console.error("Hotel image deletion error:", error);

    return res.status(500).json({
      message: "Error deleting hotel image",
    });
  }
};
