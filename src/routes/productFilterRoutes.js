import express from "express";
import { filterProducts } from "../controllers/productFilterController.js";

const router = express.Router();

router.get("/filter", filterProducts);

export default router;
