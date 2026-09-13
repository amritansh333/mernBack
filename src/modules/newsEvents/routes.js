import { Router } from "express";
import { listNewsEvents, getNewsEvent } from "./controller.js";

const router = Router();

// public listing and detail; req.query.type may be set by a mounting middleware
router.get("/", listNewsEvents);
router.get("/:slug", getNewsEvent);

export default router;
