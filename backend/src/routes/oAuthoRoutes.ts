import { Router } from "express";
import { login, register } from "../controllers/oAuthoControllers";

const router = Router();

router.post("/register", register);
router.post("/login", login);


export default router;