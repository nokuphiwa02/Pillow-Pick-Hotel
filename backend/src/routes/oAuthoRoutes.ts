
import { Router } from "express";

import {
    deleteUserProfile,
    getAllUsers,
    getUserById,
    login,
    register,
    registerAdmin,
    updateUserProfile,
    googleLogin
} from "../controllers/oAuthoControllers";

import { protect } from "../middleware/oAuthoMiddleware";

const router = Router();

// Normal authentication
router.post("/register", register);
router.post("/register-admin", protect, registerAdmin);
router.post("/login", login);

// Google authentication
router.post("/google", googleLogin);

// User management
router.get("/users", protect, getAllUsers);
router.get("/users/:id", protect, getUserById);
router.put("/users/:id", protect, updateUserProfile);
router.delete("/users/:id", protect, deleteUserProfile);

export default router;
