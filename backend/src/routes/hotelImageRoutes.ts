import { Router } from "express";
import { addHotelImage,getAllImage,getHotelImageById,updateHotelImage,deleteHotelImage } from "../controllers/hotelImageController";
import  uploadImage from '../middleware/uploadMiddleware'

const router = Router();

router.post("/hotelImage",uploadImage.array('pictures',10),addHotelImage)
router.get("/hotelImage",getAllImage)
router.get("/hotelImage/:id",getHotelImageById)
router.put("/hotelImage/:id",uploadImage.array('pictures',10),updateHotelImage)
router.delete("/hotelImage/:id",deleteHotelImage)

export default router;