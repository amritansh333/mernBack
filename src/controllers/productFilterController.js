import { filterProducts as filterProductsService } from "../services/SearchService.js";

export const filterProducts = async (req, res) => {
  try {
    const {
      category,
      material,
      industry,
      search,
      page = 1,
      limit = 12,
    } = req.query;

    const result = await filterProductsService({
      category,
      material,
      industry,
      search,
      page,
      limit,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Filter failed",
      error: error.message,
    });
  }
};
