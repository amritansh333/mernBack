import { getMachineComponentsPage } from "../services/machineComponentCatalogService.js";

export const getMachineComponents = async (req, res) => {
  const page = await getMachineComponentsPage();
  res.json(page);
};
