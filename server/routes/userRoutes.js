import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerUser, loginUser } from "../controllers/authController.js";
import {
  getUserProfile,
  getShippingAddresses,
  addShippingAddress,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// USER
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// SHIPPING ADDRESSES
router.get("/addresses", protect, getShippingAddresses);
router.post("/addresses", protect, addShippingAddress);

export default router;
