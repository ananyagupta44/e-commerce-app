import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserProfile } from "../controllers/userController.js";

const router = express.Router();
router.get("/profile", protect, getUserProfile);
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

export default router;
