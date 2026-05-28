import express, { Router } from "express";

import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  getAdminStats,
  getAllUsers,
  getAllOrders,
  getAllProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  getCategories,
  updateOrderStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", protect, admin, getAdminStats);
router.get("/users", protect, admin, getAllUsers);
router.get("/orders", protect, admin, getAllOrders);

// GET ALL PRODUCTS
router.get("/products", protect, admin, getAllProducts);

// DELETE PRODUCT
router.delete("/products/:id", protect, admin, deleteProduct);

// CREATE PRODUCT
router.post("/products", protect, admin, createProduct);

// UPDATE PRODUCT
router.put("/products/:id", protect, admin, updateProduct);

// GET CATEGORIES
router.get("/categories", protect, admin, getCategories);

// UPDATE ORDER STATUS
router.put("/orders/:id", protect, admin, updateOrderStatus);

router.post("/upload", protect, admin, upload.single("image"), (req, res) => {
  res.json({
    image: `/uploads/products/${req.file.filename}`,
  });
});

export default router;
