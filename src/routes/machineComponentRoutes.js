import express from "express";
import { getMachineComponents } from "../controllers/machineComponentController.js";

const router = express.Router();

router.get("/", getMachineComponents);

export default router;
