import express from "express";
import upload from "../../../utils/upload.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", asyncHandler(controller.getUploadsRoot));
router.post(
  "/single",
  upload.uploadSingle("misc"),
  asyncHandler(controller.uploadSingle),
);

export default router;
