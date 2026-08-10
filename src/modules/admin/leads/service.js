import Lead from "../../../modules/brochure/models/Lead.js";

export const listLeads = async ({ page = 1, limit = 10, search = "" }) => {
  const q = (search || "").trim();
  const filter = q
    ? {
        $or: [
          { firstName: { $regex: q, $options: "i" } },
          { lastName: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
          { companyName: { $regex: q, $options: "i" } },
          { mobileNumber: { $regex: q, $options: "i" } },
          { productName: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const skip = Math.max(0, page - 1) * limit;
  const [rows, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Lead.countDocuments(filter),
  ]);

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

export const getLead = async (id) => Lead.findById(id).lean();

export default { listLeads, getLead };
