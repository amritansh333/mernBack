import * as repo from "./repository.js";

export const getDashboard = async () => {
  const [totalProducts, totalCategories, totalBrands, totalMaterials, totalMachineComponents] = await Promise.all([
    repo.countProducts(),
    repo.countCategories(),
    repo.countBrands(),
    repo.countMaterials(),
    repo.countMachineComponents(),
  ]);

  const [latestProducts, latestLeads] = await Promise.all([repo.latestProducts(10), repo.latestLeads(10)]);

  // Minimal recent activity placeholder — can be extended to include downloads, quotes, drawings
  const recentActivity = [];

  return {
    totalProducts,
    totalCategories,
    totalBrands,
    totalMaterials,
    totalMachineComponents,
    latestProducts,
    latestLeads,
    recentActivity,
  };
};

export default { getDashboard };
