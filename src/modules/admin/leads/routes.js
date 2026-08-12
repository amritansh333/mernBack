import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";
import { requirePermission } from "../../../middleware/requireAuth.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", requirePermission('leads.read'), asyncHandler(controller.listLeads));
router.get("/:id", requirePermission('leads.read'), asyncHandler(controller.getLead));

export default router;
