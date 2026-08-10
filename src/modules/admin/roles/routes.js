import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";
import { adminResponse } from "../common/middleware/adminResponse.js";
import * as controller from "./controller.js";

const router = express.Router();
router.use(adminResponse);

// list, create
router.get("/", asyncHandler(controller.listRoles));
router.post(
  "/",
  requireBodyKeys(["name", "slug"]),
  asyncHandler(controller.createRole),
);

// bulk delete
router.post("/bulk-delete", asyncHandler(controller.bulkDelete));

// permission matrix and assignment
router.get("/permissions/matrix", asyncHandler(controller.permissionMatrix));
router.post(
  "/:id/permissions",
  requireBodyKeys(["permissions"]),
  asyncHandler(controller.assignPermissions),
);
router.delete(
  "/:id/permissions",
  requireBodyKeys(["permissions"]),
  asyncHandler(controller.removePermissions),
);

// item routes
router.get("/:id", asyncHandler(controller.getRole));
router.put("/:id", asyncHandler(controller.updateRole));
router.delete("/:id", asyncHandler(controller.deleteRole));

export default router;
