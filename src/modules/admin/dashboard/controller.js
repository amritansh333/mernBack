import * as service from "./service.js";

export const getDashboard = async (req, res) => {
  const payload = await service.getDashboard();
  return res.apiSuccess(payload, "Dashboard data fetched");
};

export default { getDashboard };
