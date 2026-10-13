import { Router } from "express";
import { addRoom,getAllRooms,getRoomById,updateRoom,deleteRoom } from "../controllers/roomControllers";
import { protect } from "../middleware/oAuthoMiddleware";

const router = Router();

router.post("/rooms",protect, addRoom)
router.get("/rooms", getAllRooms)
router.get("/rooms/:id",getRoomById)
router.put("/rooms/:id",protect,updateRoom)
router.delete("/rooms/:id",protect,deleteRoom)

export default router;