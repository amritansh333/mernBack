import Enquiry from "../../../models/Enquiry.js";

export const listEnquiries = async ({ page = 1, limit = 10, search = "" }) => {
  const q = (search || "").trim();
  const filter = q
    ? {
        $or: [
          { fullName: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
          { company: { $regex: q, $options: "i" } },
          { product: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const skip = Math.max(0, page - 1) * limit;
  const [rowsRaw, total] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Enquiry.countDocuments(filter),
  ]);

  // Ensure the admin DTO matches expected backend shape used by frontend transformers
  const rows = rowsRaw.map((r) => ({ ...r, name: r.fullName }));

  return {
    rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getEnquiry = async (id) => {
  const item = await Enquiry.findById(id).lean();
  return item ? { ...item, name: item.fullName } : null;
};

export default { listEnquiries, getEnquiry };
