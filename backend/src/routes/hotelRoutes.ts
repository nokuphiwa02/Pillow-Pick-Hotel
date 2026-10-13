import { Router } from "express";
import { addHotel,getAllHotels,getHotelById,updateHotel,deleteHotel } from "../controllers/hotelControllers";
import { protect } from "../middleware/oAuthoMiddleware";

const router = Router();

router.post("/hotels",protect, addHotel)
router.get("/hotels", getAllHotels)
router.get("/hotels/:id",getHotelById)
router.put("/hotels/:id",protect,updateHotel)
router.delete("/hotels/:id",protect,deleteHotel)

export default router;