import { getMachineComponentsPage } from "../services/machineComponentCatalogService.js";

export const getMachineComponents = async (req, res) => {
  try {
    const page = await getMachineComponentsPage();
    res.json(page);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch machine components",
      error: error.message,
    });
  }
};
