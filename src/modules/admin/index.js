import express from "express";
import productsRoutes from "./products/routes.js";
import categoriesRoutes from "./categories/routes.js";
import brandsRoutes from "./brands/routes.js";
import materialsRoutes from "./materials/routes.js";
import machineComponentsRoutes from "./machine-components/routes.js";
import dashboardRoutes from "./dashboard/routes.js";
import uploadsRoutes from "./uploads/routes.js";
import authRoutes from "./auth/routes.js";

const router = express.Router();

router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/brands", brandsRoutes);
router.use("/materials", materialsRoutes);
router.use("/machine-components", machineComponentsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/uploads", uploadsRoutes);
router.use("/auth", authRoutes);

export default router;
