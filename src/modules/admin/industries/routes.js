import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";
import { adminResponse } from "../common/middleware/adminResponse.js";

const router = express.Router();

router.use(adminResponse);

router.get("/", asyncHandler(controller.listIndustries));
router.get("/:id", asyncHandler(controller.getIndustry));
router.post(
  "/",
  requireBodyKeys(["name", "slug"]),
  asyncHandler(controller.createIndustry),
);
router.put("/:id", asyncHandler(controller.updateIndustry));
router.patch("/:id", asyncHandler(controller.updateIndustry));
router.delete("/:id", asyncHandler(controller.deleteIndustry));
router.post("/bulk-delete", asyncHandler(controller.bulkDelete));

export default router;
