import {
  getMachineComponentsPage,
  getMachineComponentSubcategoryPage,
} from "../services/machineComponentCatalogService.js";

export const getMachineComponents = async (req, res) => {
  const page = await getMachineComponentsPage();
  res.json(page);
};

export const getMachineComponentSubcategory = async (req, res) => {
  const page = await getMachineComponentSubcategoryPage(req.params.slug);

  res.json(page);
};