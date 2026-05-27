import express from "express";

const router = express.Router();

import { addOrderItems, getMyOrders } from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

// CREATE ORDER
router.post("/", protect, addOrderItems);

// GET MY ORDERS
router.get("/myorders", protect, getMyOrders);

export default router;
