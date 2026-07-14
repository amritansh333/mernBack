import express from "express";
import {
  getProductBySlug,
  getProductsByBrandId,
  getProductsByBrandSlug,
} from "../modules/semiFinished/controllers/semiFinishedCatalogController.js";

const router = express.Router();

router.get("/by-brand/:slug", getProductsByBrandSlug);
router.get("/", getProductsByBrandId);
router.get("/:slug", getProductBySlug);

export default router;
