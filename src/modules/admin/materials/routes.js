import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", asyncHandler(controller.listMaterials));
router.get("/:id", asyncHandler(controller.getMaterial));
router.post(
  "/",
  requireBodyKeys(["name", "slug"]),
  asyncHandler(controller.createMaterial),
);
router.put("/:id", asyncHandler(controller.updateMaterial));
router.patch("/:id", asyncHandler(controller.updateMaterial));
router.delete("/:id", asyncHandler(controller.deleteMaterial));
router.post("/bulk-delete", asyncHandler(controller.bulkDelete));

export default router;
