import * as service from "./service.js";

export const search = async (req, res) => {
  const q = req.query.q || req.query.search || "";
  const payload = await service.search(q);
  return res.apiSuccess(payload, "Admin search results");
};

export default { search };
