import express from "express";
import upload from "../../../utils/upload.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", asyncHandler(controller.listMachineComponents));
router.get("/:id", asyncHandler(controller.getMachineComponent));
router.post(
  "/",
  requireBodyKeys(["name", "slug"]),
  upload.uploadSingle("products"),
  asyncHandler(controller.createMachineComponent),
);
router.put(
  "/:id",
  upload.uploadSingle("products"),
  asyncHandler(controller.updateMachineComponent),
);
router.patch(
  "/:id",
  upload.uploadSingle("products"),
  asyncHandler(controller.updateMachineComponent),
);
router.delete("/:id", asyncHandler(controller.deleteMachineComponent));

export default router;
