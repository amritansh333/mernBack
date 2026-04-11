import express from "express";
import CatalogRequest from "../models/CatalogRequest.js";

const router = express.Router();

const catalogPdfMap = {
  cat1: "/catalogs/Polyrib_Master_Product_Catalogue.pdf",
  cat2: "/catalogs/Plascon_Brochure.pdf",
  cat3: "/catalogs/Ripla_Cutting_Boards_Catalogue.pdf",
  cat4: "/catalogs/PC_Clear_Sheets_Catalogue.pdf",
  cat5: "/catalogs/Dipra_Speciality_Sheets_Brochure.pdf",
  cat6: "/catalogs/Arete_Lining_Materials_Catalogue.pdf",
  cat7: "/catalogs/Hitech_Polymer_Sheets_Catalogue.pdf",
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
  downloadUrl: `${process.env.BASE_URL}${downloadUrl}`,
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