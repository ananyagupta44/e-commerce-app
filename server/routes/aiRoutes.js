import express from "express";

import { adminAssistant } from "../controllers/aiController.js";

const router = express.Router();

router.post("/assistant", adminAssistant);

export default router;
