import express from "express";
import {
  getAllIndustries,
  getIndustryBySlug,
} from "../controllers/industryController.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getAllIndustries)); // /api/industries
router.get("/:slug", asyncHandler(getIndustryBySlug)); // /api/industries/automotive

export default router;
