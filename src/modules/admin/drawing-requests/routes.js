import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", asyncHandler(controller.listDrawingRequests));
router.get("/:id", asyncHandler(controller.getDrawingRequest));
router.patch("/:id/status", asyncHandler(controller.updateDrawingRequestStatus));
router.delete("/:id", asyncHandler(controller.deleteDrawingRequest));

export default router;
