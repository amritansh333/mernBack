import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import { requireBodyKeys } from "../common/middleware/adminValidation.js";
import { adminResponse } from "../common/middleware/adminResponse.js";
import * as controller from "./controller.js";

const router = express.Router();
router.use(adminResponse);

// list, create
function wrap(handlerOrArray) {
  if (Array.isArray(handlerOrArray)) return handlerOrArray.map((h) => asyncHandler(h));
  return asyncHandler(handlerOrArray);
}

router.get("/", ...[].concat(wrap(controller.listRoles)));
router.post(
  "/",
  requireBodyKeys(["name", "slug"]),
  ...[].concat(wrap(controller.createRole)),
);

// bulk delete
router.post("/bulk-delete", ...[].concat(wrap(controller.bulkDelete)));

// permission matrix and assignment
router.get("/permissions/matrix", ...[].concat(wrap(controller.permissionMatrix)));
router.post(
  "/:id/permissions",
  requireBodyKeys(["permissions"]),
  ...[].concat(wrap(controller.assignPermissions)),
);
router.delete(
  "/:id/permissions",
  requireBodyKeys(["permissions"]),
  ...[].concat(wrap(controller.removePermissions)),
);

// item routes
router.get("/:id", ...[].concat(wrap(controller.getRole)));
router.put("/:id", ...[].concat(wrap(controller.updateRole)));
router.delete("/:id", ...[].concat(wrap(controller.deleteRole)));

export default router;
