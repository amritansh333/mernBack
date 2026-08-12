import express from "express";
import asyncHandler from "../../../middleware/asyncHandler.js";
import { adminResponse } from "../common/middleware/adminResponse.js";
import { requireAuth } from "../../../middleware/requireAuth.js";
import * as controller from "./controller.js";

const router = express.Router();
router.use(adminResponse);

router.post('/login', asyncHandler(controller.login));
router.post('/logout', asyncHandler(controller.logout));
router.get('/me', requireAuth, asyncHandler(controller.me));

export default router;
