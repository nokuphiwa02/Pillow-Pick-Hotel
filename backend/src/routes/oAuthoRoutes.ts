import { Router } from "express";
import { getAllUsers, getUserById, login, register } from "../controllers/oAuthoControllers";
import { protect } from '../middleware/oAuthoMiddleware';
const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/users", protect,getAllUsers)
router.get("/users/:id", protect,getUserById)


export default router;