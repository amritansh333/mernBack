import * as repo from "./repository.js";

export const getDashboard = async () => {
  // Fetch core counts in parallel
  const [
    totalProducts,
    totalCategories,
    totalBrands,
    totalMaterials,
    totalMachineComponents,
    totalSemiFinished,
    totalBrochureDownloads,
    totalLeads,
    totalDrawingRequests,
    totalQuoteRequests,
    totalMediaLibrary,
    totalUsers,
    totalRoles,
  ] = await Promise.all([
    repo.countProducts(),
    repo.countCategories(),
    repo.countBrands(),
    repo.countMaterials(),
    repo.countMachineComponents(),
    repo.countSemiFinishedProducts(),
    repo.countBrochureDownloads(),
    repo.countLeads(),
    repo.countDrawingRequests(),
    repo.countQuoteRequests(),
    repo.countMediaLibrary(),
    repo.countUsers(),
    repo.countRoles(),
  ]);

  // Fetch small preview lists used on the dashboard
  const [latestProducts, latestLeads, latestDownloads, latestMaterials] = await Promise.all([
    repo.latestProducts(10),
    repo.latestLeads(10),
    repo.latestDownloads(6),
    repo.latestMaterials(6),
  ]);

  // Build a keyed counts map that matches admin resource keys used by the frontend
  const counts = {
    products: totalProducts,
    categories: totalCategories,
    brands: totalBrands,
    materials: totalMaterials,
    'machine-components': totalMachineComponents,
    'semi-finished-products': totalSemiFinished,
    'brochure-downloads': totalBrochureDownloads,
    'media-library': totalMediaLibrary,
    leads: totalLeads,
    'drawing-requests': totalDrawingRequests,
    'quote-requests': totalQuoteRequests,
    users: totalUsers,
    roles: totalRoles,
  };

  return {
    counts,
    latestProducts,
    latestLeads,
    latestDownloads,
    latestMaterials,
    recentActivity: [],
  };
};

export default { getDashboard };
