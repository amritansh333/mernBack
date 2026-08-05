import * as service from "./service.js";

export const listLeads = async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const search = req.query.search || req.query.q || '';
  const result = await service.listLeads({ page, limit, search });
  return res.apiSuccess(result.rows, undefined, result.pagination);
};

export const getLead = async (req, res) => {
  const id = req.params.id;
  const lead = await service.getLead(id);
  return res.apiSuccess(lead);
};

export default { listLeads, getLead };
