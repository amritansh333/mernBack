import express from "express";
import CatalogRequest from "../models/CatalogRequest.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

const catalogPdfMap = {
  Polyrib_Brochure: "/catalogs/Polyrib_Master_Product_Catalogue.pdf",
  Plascon_Brochure: "/catalogs/Plascon_Brochure.pdf",
  Ripla_Brochure: "/catalogs/Ripla_Cutting_Boards_Catalogue.pdf",
  Pcclear_Brochure: "/catalogs/PC_Clear_Sheets_Catalogue.pdf",
  Dipra_Brochure: "/catalogs/Dipra_Speciality_Sheets_Brochure.pdf",
  Arete_Brochure: "/catalogs/Arete_Lining_Materials_Catalogue.pdf",
  Hitech_Brochure: "/catalogs/Hitech_Polymer_Sheets_Catalogue.pdf",
};

router.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const { name, phone, email, message, catalog_name } = req.body;

      await CatalogRequest.create({
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

      return res.status(201).json({
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

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }),
);

export default router;
