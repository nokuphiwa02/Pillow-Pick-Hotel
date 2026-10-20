import { Router } from "express";
import { addHotel,getAllHotels,getHotelById,updateHotel,deleteHotel } from "../controllers/hotelControllers";
import { protect} from "../middleware/oAuthoMiddleware";
import { uploadImage } from "../middleware/uploadMiddleware";

const router = Router();

router.post("/hotels",protect,uploadImage.single('image'), addHotel)
router.get("/hotels", getAllHotels)
router.get("/hotels/:id",getHotelById)
router.put("/hotels/:id",uploadImage.single('image'),protect,updateHotel)
router.delete("/hotels/:id",protect,uploadImage.single('image'),deleteHotel)

export default router;