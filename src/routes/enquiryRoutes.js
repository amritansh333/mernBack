import express from "express";
import mongoose from "mongoose";
import Enquiry from "../models/Enquiry.js";


const router = express.Router();
const { createEnquiry } = require("../controllers/enquiryController");

router.post("/", createEnquiry);

export default router;