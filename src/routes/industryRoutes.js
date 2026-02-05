import express from "express";
import {
  getAllIndustries,
  getIndustryBySlug
} from "../controllers/industryController.js";

const router = express.Router();

router.get("/", getAllIndustries);        // /api/industries
router.get("/:slug", getIndustryBySlug);  // /api/industries/automotive

export default router;
