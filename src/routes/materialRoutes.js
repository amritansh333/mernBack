import express from "express";
import {
  getAllMaterials,
  getMaterialBySlug
} from "../controllers/materialController.js";

const router = express.Router();

router.get("/", getAllMaterials);        // /api/materials
router.get("/:slug", getMaterialBySlug); // /api/materials/hdpe

export default router;
