import express from "express";
import productsRoutes from "./products/routes.js";
import categoriesRoutes from "./categories/routes.js";
import brandsRoutes from "./brands/routes.js";
import subcategoriesRoutes from "./subcategories/routes.js";
import materialsRoutes from "./materials/routes.js";
import dashboardRoutes from "./dashboard/routes.js";
import uploadsRoutes from "./uploads/routes.js";
import authRoutes from "./auth/routes.js";
import searchRoutes from "./search/routes.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import leadsRoutes from "./leads/routes.js";
import brochureRoutes from "./brochure-downloads/routes.js";
import drawingRequestsRoutes from "./drawing-requests/routes.js";
import catalogRequestsRoutes from "./catalogrequests/routes.js";
import enquiriesRoutes from "./enquiries/routes.js";
import mediaLibraryRoutes from "./media-library/routes.js";
import contentRoutes from "./content/routes.js";
import usersRoutes from "./users/routes.js";
import rolesRoutes from "./roles/routes.js";
import systemLogsRoutes from "./system-logs/routes.js";
import blogRoutes from "./blog/routes.js";
import industriesRoutes from "./industries/routes.js";

const router = express.Router();

// Auth routes (public)
router.use("/auth", authRoutes);

// Require auth for all admin routes after this point
router.use(requireAuth);

router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/subcategories", subcategoriesRoutes);
router.use("/brands", brandsRoutes);
router.use("/materials", materialsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/search", searchRoutes);
router.use("/leads", leadsRoutes);
router.use("/brochure-downloads", brochureRoutes);
router.use("/drawing-requests", drawingRequestsRoutes);
router.use("/catalogrequests", catalogRequestsRoutes);
router.use("/enquiries", enquiriesRoutes);
router.use("/media-library", mediaLibraryRoutes);
router.use("/content", contentRoutes);
router.use("/users", usersRoutes);
router.use("/roles", rolesRoutes);
router.use("/system-logs", systemLogsRoutes);
router.use("/blog", blogRoutes);
router.use("/industries", industriesRoutes);
router.use("/uploads", uploadsRoutes);

export default router;
