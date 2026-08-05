import express from "express";
import productsRoutes from "./products/routes.js";
import categoriesRoutes from "./categories/routes.js";
import brandsRoutes from "./brands/routes.js";
import materialsRoutes from "./materials/routes.js";
import machineComponentsRoutes from "./machine-components/routes.js";
import dashboardRoutes from "./dashboard/routes.js";
import uploadsRoutes from "./uploads/routes.js";
import authRoutes from "./auth/routes.js";
import searchRoutes from "./search/routes.js";
import leadsRoutes from "./leads/routes.js";
import brochureRoutes from "./brochure-downloads/routes.js";
import drawingRequestsRoutes from "./drawing-requests/routes.js";
import quoteRequestsRoutes from "./quote-requests/routes.js";
import mediaLibraryRoutes from "./media-library/routes.js";
import contentRoutes from "./content/routes.js";
import usersRoutes from "./users/routes.js";

const router = express.Router();

router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/brands", brandsRoutes);
router.use("/materials", materialsRoutes);
router.use("/machine-components", machineComponentsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/search", searchRoutes);
router.use("/leads", leadsRoutes);
router.use("/brochure-downloads", brochureRoutes);
router.use("/drawing-requests", drawingRequestsRoutes);
router.use("/quote-requests", quoteRequestsRoutes);
router.use("/media-library", mediaLibraryRoutes);
router.use("/content", contentRoutes);
router.use("/users", usersRoutes);
router.use("/uploads", uploadsRoutes);
router.use("/auth", authRoutes);

export default router;
