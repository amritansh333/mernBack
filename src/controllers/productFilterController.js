import { filterProducts as filterProductsService } from "../services/SearchService.js";

export const filterProducts = async (req, res) => {
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
};
