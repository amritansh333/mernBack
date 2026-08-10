import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";

const router = express.Router();
import { adminResponse } from "../common/middleware/adminResponse.js";
router.use(adminResponse);

router.get("/", asyncHandler(controller.listContent));
router.get("/:id", asyncHandler(controller.getContent));
router.post("/", asyncHandler(controller.createContent));
router.put("/:id", asyncHandler(controller.updateContent));
router.delete("/:id", asyncHandler(controller.deleteContent));
router.post("/bulk-delete", asyncHandler(controller.bulkDelete));

export default router;
