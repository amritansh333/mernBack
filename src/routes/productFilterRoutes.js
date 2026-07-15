import express from "express";
import { filterProducts } from "../controllers/productFilterController.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/filter", asyncHandler(filterProducts));

export default router;
