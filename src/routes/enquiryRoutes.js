import express from "express";
import { createEnquiry } from "../controllers/enquiryController.js";
import asyncHandler from "../middleware/asyncHandler.js";


const router = express.Router();


router.post("/", asyncHandler(createEnquiry));

export default router;
