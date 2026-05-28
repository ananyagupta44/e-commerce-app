import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerUser, loginUser } from "../controllers/authController.js";
import { getUserProfile } from "../controllers/userController.js";

const router = express.Router();

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// USER
router.get("/profile", protect, getUserProfile);

export default router;
