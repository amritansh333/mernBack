import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", asyncHandler(controller.listSubcategories));
router.get("/:id", asyncHandler(controller.getSubcategory));
router.post("/", requireBodyKeys(["name", "slug", "category"]), asyncHandler(controller.createSubcategory));
router.put("/:id", asyncHandler(controller.updateSubcategory));
router.patch("/:id", asyncHandler(controller.updateSubcategory));
router.delete("/:id", asyncHandler(controller.deleteSubcategory));
router.post("/bulk-delete", asyncHandler(controller.bulkDelete));

export default router;
