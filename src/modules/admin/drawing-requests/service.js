import DrawingRequest from "../../../models/DrawingRequest.js";

export const listDrawingRequests = async ({ page = 1, limit = 10, search = "" }) => {
  const q = (search || "").trim();
  const filter = q
    ? { $or: [{ fullName: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }, { company: { $regex: q, $options: 'i' } }] }
    : {};

  const skip = Math.max(0, page - 1) * limit;
  const [rows, total] = await Promise.all([
    DrawingRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    DrawingRequest.countDocuments(filter),
  ]);

  return {
    rows,
    pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
  };
};

export const getDrawingRequest = async (id) => DrawingRequest.findById(id).lean();

export default { listDrawingRequests, getDrawingRequest };