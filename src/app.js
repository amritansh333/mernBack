import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import catalogRoutes from "./routes/catalogRequestRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import productFilterRoutes from "./routes/productFilterRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import machineComponentRoutes from "./modules/machineComponents/routes/machineComponentRoutes.js";
import semiFinishedRoutes from "./modules/semiFinished/routes/semiFinishedRoutes.js";
import industryRoutes from "./routes/industryRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ✅ CORS — OPEN FOR NOW (SAFE FOR DEV & INITIAL DEPLOY) */
app.use(cors());

/* ✅ BODY PARSER */
app.use(express.json());

/* ✅ STATIC IMAGE SERVING */
app.use(
  "/uploads/brands",
  express.static(path.join(__dirname, "../public/uploads/brands"))
);

app.use(
  "/uploads/products",
  express.static(path.join(__dirname, "../public/uploads/products"))
);

app.use(
  "/uploads/subcategories",
  express.static(path.join(__dirname, "../public/uploads/subcategories"))
);

app.use(
  "/catalogs",
  express.static(path.join(__dirname, "../public/catalogs"))
);

/* API ROUTES */
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productFilterRoutes);
app.use("/api/products", productRoutes);
app.use("/api/semi-finished", semiFinishedRoutes);
app.use("/api/machine-components", machineComponentRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/catalogrequests", catalogRoutes);


export default app;
