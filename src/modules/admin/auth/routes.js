import express from "express";
const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

// Placeholder auth admin endpoints (none implemented).
export default router;
