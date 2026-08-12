import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requirePermission } from "../../../middleware/requireAuth.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", requirePermission('catalogRequests.read'), asyncHandler(controller.listCatalogRequests));
router.get("/:id", requirePermission('catalogRequests.read'), asyncHandler(controller.getCatalogRequest));

export default router;
