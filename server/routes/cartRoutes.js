import express from "express";

const router = express.Router();

import {
  getCart,
  addToCart,
  removeFromCart,
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

// GET CART
router.get("/", protect, getCart);

// ADD TO CART
router.post("/", protect, addToCart);

// REMOVE ITEM
router.delete("/:id", protect, removeFromCart);

export default router;
