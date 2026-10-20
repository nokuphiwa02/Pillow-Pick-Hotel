import { Request, Response } from "express";
import * as hotelImageService from "../service/hotelImageService";

export const addHotelImage = async (req: Request, res: Response) => {
  try {
   const uploadFiles = req.files as any[] | undefined

   const filePaths: string[] = uploadFiles ? uploadFiles.map(file => file.path) :[];

    const newHotel = await hotelImageService.createhotelImage(req.body);
    res.status(201).json(newHotel);
  } catch (error) {
   
    console.error("HotelImage Creation error:", error);

    res.status(500).json({ message: "Error in creating HotelImage" });
  }
};

export const getAllImage = async (req: Request, res: Response) => {
  try {
    const HotelImages = await hotelImageService.findAllhotelImage();
    res.status(200).json(HotelImages);
  } catch (error) {
    console.error("Error retrieving HotelImage:", error);
    res.status(500).json({ message: "Error retrieving HotelImage" });
  }
};

export const getHotelImageById = async (req: Request, res: Response) => {
try{
    const id = parseInt(req.params.id as string);

    const HotelImages = await hotelImageService.findhotelImageById(id)

    if (!HotelImages){
        return res.status(404).json({message:"HotelImage not found"})
    }
    return res.status(200).json(HotelImages)
}catch (error){
res.status(500).json({message:"error retrieving HotelImages"})
}
};

export const updateHotelImage = async (req: Request, res:Response) => {
    try{
         if (req.user!.role !== 'admin') {
            return res.status(403).json({ message: "Only Admin can update HotelImages" })
        }
        const id = parseInt(req.params.id as string)
        const updateHotelImage = await hotelImageService.updateHotelImageById(id,req.body);

        if(!updateHotelImage){
            return res.status(404).json({message:"HotelImages not found"})
        }
        res.status(200).json(updateHotelImage)

    }catch(error){
        console.log("update HotelImages error:", error); 
      res.status(500).json({message:"error updating HotelImages"})
    }
};

export const deleteHotelImage = async(req: Request,res:Response) => {
    try{
          if (req.user!.role !== 'admin') {
            return res.status(403).json({ message: "Only Admin can delete HotelImages" })
        }
        const id =parseInt(req.params.id as string)
        const deleteImage = await hotelImageService.deletehotelImageById(id)

        if(!deleteImage){
            return res.status(404).json({message:"hotel not HotelImages"});
        }
        res.status(200).json({message:"HotelImages Deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Error deleting HotelImages"})
    }
};