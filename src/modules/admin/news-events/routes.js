import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { validateObjectIdParam } from "../common/middleware/adminValidation.js";
import { adminResponse } from "../common/middleware/adminResponse.js";
import { requirePermission } from "../../../middleware/requireAuth.js";

const router = express.Router();
router.use(adminResponse);

router.get("/", requirePermission('newsEvents.read'), asyncHandler(controller.list));
router.get("/:id", validateObjectIdParam('id'), requirePermission('newsEvents.read'), asyncHandler(controller.get));
router.post("/", requirePermission('newsEvents.create'), asyncHandler(controller.create));
router.put("/:id", validateObjectIdParam('id'), requirePermission('newsEvents.update'), asyncHandler(controller.update));
router.patch("/:id/publish", validateObjectIdParam('id'), requirePermission('newsEvents.publish'), asyncHandler(controller.publish));
router.patch("/:id/unpublish", validateObjectIdParam('id'), requirePermission('newsEvents.publish'), asyncHandler(controller.unpublish));
router.patch("/:id/feature", validateObjectIdParam('id'), requirePermission('newsEvents.update'), asyncHandler(controller.feature));
router.delete("/:id", validateObjectIdParam('id'), requirePermission('newsEvents.delete'), asyncHandler(controller.remove));

export default router;
