import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

//Route Imports
import productRoutes from "./routes/productRoutes.js";
import industryRoutes from "./routes/industryRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import productFilterRoutes from "./routes/productFilterRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

import catalogRequestRoutes from "./routes/catalogRequestRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middlewares
app.use(cors());
app.use(express.json());

app.use(
    "/catalogs",
    express.static(path.join(__dirname, "../public/catalogs")
));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public/uploads"))
);

//API Routes
app.use("/api/products", productFilterRoutes);
app.use("/api/products", productRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/categories", categoryRoutes);

app.use("/api/catalog-requests", catalogRequestRoutes);


export default app;
