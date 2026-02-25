import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import industryRoutes from "./routes/industryRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ✅ CORS — OPEN FOR NOW (SAFE FOR DEV & INITIAL DEPLOY) */
app.use(cors());

/* ✅ BODY PARSER */
app.use(express.json());

/* ✅ STATIC IMAGE SERVING */
app.use(
  "/uploads/products",
  express.static(path.join(__dirname, "../public/uploads/products"))
);

/* ✅ API ROUTES */
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/materials", materialRoutes);

export default app;