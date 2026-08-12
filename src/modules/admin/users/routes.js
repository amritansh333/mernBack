import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import * as controller from "./controller.js";

const router = express.Router();

function wrap(handlerOrArray) {
  if (Array.isArray(handlerOrArray)) return handlerOrArray.map((h) => asyncHandler(h));
  return asyncHandler(handlerOrArray);
}

router.get("/", ...[].concat(wrap(controller.listUsers)));
router.get("/:id", ...[].concat(wrap(controller.getUser)));
router.post("/", ...[].concat(wrap(controller.createUser)));
router.put("/:id", ...[].concat(wrap(controller.updateUser)));
router.delete("/:id", ...[].concat(wrap(controller.deleteUser)));
router.post("/bulk-delete", ...[].concat(wrap(controller.bulkDelete)));

export default router;
