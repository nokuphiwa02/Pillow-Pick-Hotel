import { Router } from "express";
import { addHotelImage,getAllImage,getHotelImageById,updateHotelImage,deleteHotelImage } from "../controllers/hotelImageController";
import  uploadImage from '../middleware/uploadMiddleware'

const router = Router();

router.post("/hotelImage",uploadImage.array('pictures',10),addHotelImage)
router.get("/hotelImage",uploadImage.array('pictures',10),getAllImage)
router.get("./hotelImage/:id",uploadImage.array('pictures',10),getHotelImageById)
router.put("/hotelImage/:id",uploadImage.array('pictures',10),updateHotelImage)
router.delete("/hotelImage/:id",uploadImage.array('pictures',10),deleteHotelImage)

export default router;