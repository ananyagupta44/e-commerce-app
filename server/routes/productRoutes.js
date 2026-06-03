import express from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getPublicCategories,
  getProductsByCategory,
  searchProducts,
  getBestDeals,
  createProductReview,
  getSearchSuggestions,
} from "../controllers/productController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

router.post("/", protect, admin, createProduct);

router.get("/categories", getPublicCategories);

router.get("/category/:category", getProductsByCategory);

router.get("/search/:keyword", searchProducts);

router.get("/best-deals", getBestDeals);

router.get("/search-suggestions", getSearchSuggestions);

router.get("/:id", getProductById);

router.put("/:id", protect, admin, updateProduct);

router.delete("/:id", protect, admin, deleteProduct);

router.post("/:id/reviews", protect, createProductReview);

export default router;
