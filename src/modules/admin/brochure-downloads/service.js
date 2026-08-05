import mongoose from "mongoose";
import BrochureLead from "../../brochure/models/Lead.js";

export const listDownloads = async ({ page = 1, limit = 10, search = "" }) => {
  const q = (search || "").trim();
  const filter = q
    ? { $or: [{ firstName: { $regex: q, $options: 'i' } }, { lastName: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }, { companyName: { $regex: q, $options: 'i' } }] }
    : {};

  const Model = mongoose.models.Lead || BrochureLead;
  if (!Model) return { rows: [], pagination: { page, limit, total: 0, pages: 1 } };

  const skip = Math.max(0, page - 1) * limit;
  const [rows, total] = await Promise.all([
    Model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Model.countDocuments(filter),
  ]);

  return {
    rows,
    pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
  };
};

export const getDownload = async (id) => {
  const Model = mongoose.models.Lead || BrochureLead;
  if (!Model) return null;
  return Model.findById(id).lean();
};

export default { listDownloads, getDownload };
