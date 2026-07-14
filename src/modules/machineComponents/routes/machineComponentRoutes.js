import express from "express";
import { getMachineComponents } from "../controllers/machineComponentCatalogController.js";
import asyncHandler from "../../../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getMachineComponents));

export default router;
