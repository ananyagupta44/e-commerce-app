import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";
import { registerUser, loginUser } from "../controllers/authController.js";
import {
  getUserProfile,
  getShippingAddresses,
  addShippingAddress,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,

  message: {
    message: "Too many password reset requests. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// USER
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// SHIPPING ADDRESSES
router.get("/addresses", protect, getShippingAddresses);
router.post("/addresses", protect, addShippingAddress);

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;
