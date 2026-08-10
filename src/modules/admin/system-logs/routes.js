import express from "express";
import * as controller from "./controller.js";

const router = express.Router();

router.get("/", controller.listLogs);
router.get("/:id", controller.getLog);
router.delete("/:id", controller.deleteLog);

export default router;
