import QuoteRequest from "../../../models/QuoteRequest.js";

export const listQuoteRequests = async ({ page = 1, limit = 10, search = "" }) => {
  const q = (search || "").trim();
  const filter = q
    ? { $or: [{ fullName: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }, { company: { $regex: q, $options: 'i' } }] }
    : {};

  const skip = Math.max(0, page - 1) * limit;
  const [rows, total] = await Promise.all([
    QuoteRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    QuoteRequest.countDocuments(filter),
  ]);

  return {
    rows,
    pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
  };
};

export const getQuoteRequest = async (id) => QuoteRequest.findById(id).lean();

export default { listQuoteRequests, getQuoteRequest };