import { Router } from "express";
import { register } from "../controllers/oAuthoControllers";

const router = Router();

router.post("/register", register);


export default router;