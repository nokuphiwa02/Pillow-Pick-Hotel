import { Router } from "express";
import { deleteUserProfile, getAllUsers, getUserById, login,
 register, updateUserProfile } from "../controllers/oAuthoControllers";
import { protect } from '../middleware/oAuthoMiddleware';
const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/users", protect,getAllUsers)
router.get("/users/:id", protect,getUserById)
router.put("/users/:id", protect, updateUserProfile)
router.delete("/users/:id",protect, deleteUserProfile)



export default router;