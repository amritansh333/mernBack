import express from "express";
import {
  getAllMaterials,
  getMaterialBySlug,
} from "../controllers/materialController.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getAllMaterials)); // /api/materials
router.get("/:slug", asyncHandler(getMaterialBySlug)); // /api/materials/hdpe

export default router;
