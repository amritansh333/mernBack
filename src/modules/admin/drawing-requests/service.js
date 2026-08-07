import fs from "fs";
import path from "path";
import DrawingRequest from "../../../models/DrawingRequest.js";

const ALLOWED_SORT_FIELDS = new Set(["createdAt", "updatedAt", "fullName", "company", "email", "status"]);
export const ALLOWED_STATUSES = ["NEW", "UNDER_REVIEW", "QUOTED", "COMPLETED", "REJECTED"];

export const listDrawingRequests = async ({ page = 1, limit = 10, search = "", status = "", sortBy = "createdAt", sortOrder = "desc" }) => {
  const pageNumber = Number.isFinite(page) ? Math.max(1, page) : 1;
  const limitNumber = Number.isFinite(limit) ? Math.max(1, Math.min(limit, 100)) : 10;
  const q = (search || "").trim();
  const normalizedStatus = typeof status === "string" ? status.trim().toUpperCase() : "";
  const filter = {};

  if (q) {
    filter.$or = [
      { fullName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { company: { $regex: q, $options: "i" } },
    ];
  }

  if (normalizedStatus && ALLOWED_STATUSES.includes(normalizedStatus)) {
    filter.status = normalizedStatus;
  }

  const sortField = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : "createdAt";
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const skip = Math.max(0, pageNumber - 1) * limitNumber;

  const [rows, total] = await Promise.all([
    DrawingRequest.find(filter).sort({ [sortField]: sortDirection }).skip(skip).limit(limitNumber).lean(),
    DrawingRequest.countDocuments(filter),
  ]);

  return {
    rows,
    pagination: { page: pageNumber, limit: limitNumber, total, pages: Math.max(1, Math.ceil(total / limitNumber)) },
  };
};

export const getDrawingRequest = async (id) => DrawingRequest.findById(id).lean();

export const updateDrawingRequestStatus = async (id, status) => {
  const normalizedStatus = typeof status === "string" ? status.trim().toUpperCase() : "";

  if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
    const error = new Error("Invalid status value");
    error.statusCode = 422;
    throw error;
  }

  return DrawingRequest.findByIdAndUpdate(
    id,
    { status: normalizedStatus },
    { new: true, runValidators: true },
  ).lean();
};

const publicRoot = path.resolve(process.cwd(), "public");

const deleteFile = async (relativePath) => {
  const destination = path.resolve(publicRoot, relativePath);
  if (!destination.startsWith(publicRoot + path.sep) && destination !== publicRoot) {
    throw new Error("Invalid file path");
  }

  try {
    await fs.promises.unlink(destination);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
};

export const deleteDrawingRequest = async (id) => {
  const item = await DrawingRequest.findById(id).lean();
  if (!item) {
    return null;
  }

  const files = Array.isArray(item.files) ? item.files : [];
  const results = await Promise.allSettled(files.map((file) => deleteFile(file.relativePath)));
  const failed = results.find((result) => result.status === "rejected");

  if (failed) {
    const error = failed.reason instanceof Error ? failed.reason : new Error("Failed to delete drawing files");
    error.statusCode = 500;
    throw error;
  }

  await DrawingRequest.deleteOne({ _id: id });
  return item;
};

export default { listDrawingRequests, getDrawingRequest, updateDrawingRequestStatus, deleteDrawingRequest };