import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import env from "./config/env.js";
import corsMiddleware from "./config/cors.js";
import { requestLogger } from "./config/logger.js";
import {
  apiRateLimiter,
  compressionMiddleware,
  helmetMiddleware,
  hppMiddleware,
  mongoSanitizeMiddleware,
} from "./config/security.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import catalogRoutes from "./routes/catalogRequestRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import productFilterRoutes from "./routes/productFilterRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import brochureRoutes from "./modules/brochure/routes/brochureRoutes.js";
import machineComponentRoutes from "./modules/machineComponents/routes/machineComponentRoutes.js";
import semiFinishedRoutes from "./modules/semiFinished/routes/semiFinishedRoutes.js";
import industryRoutes from "./routes/industryRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import drawingRequestRoutes from "./modules/drawing-requests/routes.js";

// Admin routes
import adminModule from "./modules/admin/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.get("/favicon.ico", (req, res) => res.sendStatus(204));

app.set("trust proxy", env.trustProxy);

if (env.logRequests) {
  app.use(requestLogger);
}

app.use(helmetMiddleware);
app.use(compressionMiddleware);
app.use(corsMiddleware);

app.use(express.json({ limit: env.bodyLimit }));
app.use(mongoSanitizeMiddleware);
app.use(hppMiddleware);

app.use(
  "/uploads/brands",
  express.static(path.join(__dirname, "../public/uploads/brands")),
);

app.use(
  "/uploads/products",
  express.static(path.join(__dirname, "../public/uploads/products")),
);

app.use(
  "/uploads/subcategories",
  express.static(path.join(__dirname, "../public/uploads/subcategories")),
);

app.use(
  "/uploads/drawings",
  express.static(path.join(__dirname, "../public/uploads/drawings")),
);

app.use(
  "/catalogs",
  express.static(path.join(__dirname, "../public/catalogs")),
);

app.use("/pdfs", express.static(path.join(__dirname, "../public/pdfs")));

app.use("/api", apiRateLimiter);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productFilterRoutes);
app.use("/api/products", productRoutes);
app.use("/api/brochure", brochureRoutes);
app.use("/api/semi-finished", semiFinishedRoutes);
app.use("/api/machine-components", machineComponentRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/drawing-requests", drawingRequestRoutes);
app.use("/api/catalogrequests", catalogRoutes);

// Admin APIs (do not interfere with public routes)
app.use("/api/admin", adminModule);

app.use(notFound);
app.use(errorHandler);

export default app;
