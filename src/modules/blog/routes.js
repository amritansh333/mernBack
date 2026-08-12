import { Router } from "express";

import { getBlogPost, getBlogPosts } from "./controller.js";

const router = Router();

router.get("/", getBlogPosts);

router.get("/:slug", getBlogPost);

export default router;
