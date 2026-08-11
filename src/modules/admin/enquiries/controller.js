import * as service from "./service.js";

export const listEnquiries = async (req, res) => {
  const page = parseInt(req.query.page || "1", 10) || 1;
  const limit = parseInt(req.query.limit || "10", 10) || 10;
  const search = req.query.search || req.query.q || "";
  const status =
    typeof req.query.status === "string" ? req.query.status.trim() : "";

  const result = await service.listEnquiries({ page, limit, search, status });
  return res.apiSuccess(result.rows, undefined, result.pagination);
};

export const getEnquiry = async (req, res) => {
  const id = req.params.id;
  const item = await service.getEnquiry(id);

  if (!item) {
    return res.apiError(404, "Enquiry not found");
  }

  return res.apiSuccess(item);
};

export const updateEnquiryStatus = async (req, res) => {
  const id = req.params.id;
  const status =
    typeof req.body.status === "string" ? req.body.status.trim() : "";

  try {
    const item = await service.updateEnquiryStatus(id, status);

    if (!item) {
      return res.apiError(404, "Enquiry not found");
    }

    return res.apiSuccess(item, "Status updated successfully");
  } catch (error) {
    return res.apiError(
      error.statusCode || 500,
      error.message || "Unable to update status",
    );
  }
};

export default { listEnquiries, getEnquiry, updateEnquiryStatus };
