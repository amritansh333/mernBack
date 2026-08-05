import Enquiry from "../../../models/Enquiry.js";

export const listLeads = async ({ page = 1, limit = 10, search = "" }) => {
  const q = (search || "").trim();
  const filter = q
    ? { $or: [{ fullName: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }, { company: { $regex: q, $options: 'i' } }] }
    : {};

  const skip = Math.max(0, page - 1) * limit;
  const [rows, total] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Enquiry.countDocuments(filter),
  ]);

  return {
    rows,
    pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
  };
};

export const getLead = async (id) => Enquiry.findById(id).lean();

export default { listLeads, getLead };
