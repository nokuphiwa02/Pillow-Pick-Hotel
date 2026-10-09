import { Router } from "express";
import { getAllUsers, login, register } from "../controllers/oAuthoControllers";
import { protect } from '../middleware/oAuthoMiddleware';
const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/users", protect,getAllUsers)


export default router;