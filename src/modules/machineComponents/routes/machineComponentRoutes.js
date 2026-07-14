import express from "express";
import { getMachineComponents } from "../controllers/machineComponentCatalogController.js";

const router = express.Router();

router.get("/", getMachineComponents);

export default router;
