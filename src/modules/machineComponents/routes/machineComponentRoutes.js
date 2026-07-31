import express from "express";
import {
  getMachineComponents,
  getMachineComponentSubcategory,
} from "../controllers/machineComponentCatalogController.js";
import asyncHandler from "../../../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getMachineComponents));

router.get(
  "/subcategory/:slug",
  asyncHandler(getMachineComponentSubcategory)
);

export default router;