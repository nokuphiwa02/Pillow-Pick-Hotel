
import { Router } from "express";
import {
  addRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from "../controllers/roomControllers";
import { protect } from "../middleware/oAuthoMiddleware";
import uploadImage from "../middleware/uploadMiddleware";

const router = Router();

router.post(
  "/rooms",
  protect,
  uploadImage.single("image"),
  addRoom,
);

router.get("/rooms", getAllRooms);

router.get("/rooms/:id", getRoomById);

router.put(
  "/rooms/:id",
  protect,
  uploadImage.single("image"),
  updateRoom,
);

router.delete("/rooms/:id", protect, deleteRoom);

export default router;
