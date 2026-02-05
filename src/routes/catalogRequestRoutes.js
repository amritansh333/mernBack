import express from "express";
import CatalogRequest from "../models/CatalogRequest.js";

const router = express.Router();

const catalogPdfMap = {
  "Polyrib": "/catalogs/Polyrib.pdf",
  "Arete": "/catalogs/Arete%20Lining%20Materials.pdf",
  "Dipra": "/catalogs/Dipra%20Specialty%20Sheets.pdf",
  "Hitech": "/catalogs/Hitech%20Polymer%20Sheets.pdf",
  "PC Clear": "/catalogs/PC%20Clear%20Sheets.pdf",
  "Plascon": "/catalogs/Plascon.pdf",
  "Ripla": "/catalogs/Ripla%20Cutting%20Boards.pdf"
};


router.post("/", async (req, res) => {
  try {
    const { name, phone, email, message, catalog_name } = req.body;

    const data = await CatalogRequest.create({
      name,
      phone,
      email,
      message,
      catalog_name,
    });

    const downloadUrl = catalogPdfMap[catalog_name];

if (!downloadUrl) {
  return res.status(400).json({
    success: false,
    message: "Invalid catalog selected",
  });
}

res.status(201).json({
  success: true,
  message: "Request submitted successfully",
  downloadUrl
});



  } catch (err) {
    // Mongoose validation error
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({
        success: false,
        message: firstError,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;