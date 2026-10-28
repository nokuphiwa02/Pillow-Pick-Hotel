import { Router } from "express";
import { addProfile,getProfileById ,updateProfile} from "../controllers/profileControllers";

const router = Router();

router.post("/profile", addProfile)
router.get("/profile/:id",getProfileById)
router.put("/profile",updateProfile)

export default router;