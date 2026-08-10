import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", asyncHandler(controller.listSettings));
router.get("/:id", asyncHandler(controller.getSetting));
router.post(
  "/",
  requireBodyKeys(["key", "name"]),
  asyncHandler(controller.createSetting),
);
router.put("/:id", asyncHandler(controller.updateSetting));
router.patch("/:id", asyncHandler(controller.updateSetting));
router.delete("/:id", asyncHandler(controller.deleteSetting));
router.post("/bulk-delete", asyncHandler(controller.bulkDelete));

export default router;
