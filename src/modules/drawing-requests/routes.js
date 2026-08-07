import express from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { drawingRequestUpload } from "./service.js";

const router = express.Router();

router.post("/", drawingRequestUpload, asyncHandler(controller.createDrawingRequest));

export default router;
