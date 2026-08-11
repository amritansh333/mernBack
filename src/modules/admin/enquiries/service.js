import Enquiry from "../../../models/Enquiry.js";

export const ALLOWED_STATUSES = [
  "New",
  "Contacted",
  "In Progress",
  "Resolved",
  "Closed",
];

export const listEnquiries = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
}) => {
  const q = (search || "").trim();
  const normalizedStatus = typeof status === "string" ? status.trim() : "";
  const filter = {};

  if (q) {
    filter.$or = [
      { fullName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { company: { $regex: q, $options: "i" } },
      { product: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
      { requirement: { $regex: q, $options: "i" } },
    ];
  }

  if (normalizedStatus && ALLOWED_STATUSES.includes(normalizedStatus)) {
    filter.status = normalizedStatus;
  }

  const skip = Math.max(0, page - 1) * limit;
  const [rowsRaw, total] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Enquiry.countDocuments(filter),
  ]);

  const rows = rowsRaw.map((r) => ({
    ...r,
    name: r.fullName,
    status: r.status || "New",
  }));

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
  return item
    ? { ...item, name: item.fullName, status: item.status || "New" }
    : null;
};

export const updateEnquiryStatus = async (id, status) => {
  const normalizedStatus = typeof status === "string" ? status.trim() : "";

  if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
    const error = new Error("Invalid status value");
    error.statusCode = 422;
    throw error;
  }

  return Enquiry.findByIdAndUpdate(
    id,
    { status: normalizedStatus },
    { new: true, runValidators: true },
  ).lean();
};

export default { listEnquiries, getEnquiry, updateEnquiryStatus };
