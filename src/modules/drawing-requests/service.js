import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import DrawingRequest from "../../models/DrawingRequest.js";
import logger from "../../config/logger.js";

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".dwg",
  ".dxf",
  ".step",
  ".stp",
]);
const CAD_EXTENSIONS = new Set([".dwg", ".dxf", ".step", ".stp"]);
const ALLOWED_MIME_TYPES_BY_EXTENSION = {
  pdf: ["application/pdf"],
  png: ["image/png"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  dwg: [
    "application/acad",
    "application/x-acad",
    "application/x-autocad",
    "application/octet-stream",
  ],
  dxf: ["application/dxf", "text/plain", "application/octet-stream"],
  step: [
    "application/step",
    "application/sla",
    "application/octet-stream",
    "application/x-step",
    "model/step",
  ],
  stp: [
    "application/step",
    "application/sla",
    "application/octet-stream",
    "application/x-step",
    "model/step",
  ],
};

const UPLOAD_BASE = path.join(process.cwd(), "public", "uploads", "drawings");

const ensureDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const getUploadDirectory = () => {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const destination = path.join(UPLOAD_BASE, year, month);
  ensureDirectory(destination);
  return destination;
};

const isValidEmail = (value) => {
  if (!value) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const isSafeOriginalName = (originalName) => {
  if (!originalName || typeof originalName !== "string") {
    return false;
  }

  if (originalName.includes("\0")) {
    return false;
  }

  if (originalName.includes("../") || originalName.includes("..\\")) {
    return false;
  }

  if (originalName.includes("/") || originalName.includes("\\")) {
    return false;
  }

  return true;
};

const getFileExtension = (originalName) =>
  path.extname(originalName).toLowerCase();

const isAllowedMimeType = (extension, mimeType) => {
  const allowed = ALLOWED_MIME_TYPES_BY_EXTENSION[extension.slice(1)];

  if (!allowed) {
    return false;
  }

  return allowed.includes(mimeType);
};

const createMulterError = (message, statusCode = 415) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      cb(null, getUploadDirectory());
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const extension = getFileExtension(file.originalname) || "";
    const filename = `${crypto.randomUUID()}${extension}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const originalName = file.originalname || "";
  const extension = getFileExtension(originalName);

  if (!isSafeOriginalName(originalName)) {
    return cb(createMulterError("Invalid file name provided", 400), false);
  }

  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
    return cb(createMulterError("Unsupported file type", 415), false);
  }

  if (!isAllowedMimeType(extension, file.mimetype)) {
    return cb(createMulterError("Unsupported file type", 415), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: MAX_FILES },
  fileFilter,
});

export const drawingRequestUpload = (req, res, next) => {
  const uploadHandler = upload.array("drawings", MAX_FILES);

  uploadHandler(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        error.statusCode = 413;
        error.message = "One or more files exceed the maximum size of 20 MB";
      } else if (error.code === "LIMIT_FILE_COUNT") {
        error.statusCode = 413;
        error.message = "Too many files uploaded";
      } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
        error.statusCode = 415;
        error.message = "Unexpected file field or too many files";
      } else {
        error.statusCode = 400;
      }
    }

    logger.warn(
      { err: error, ip: req.ip, url: req.originalUrl },
      "Drawing request upload failed",
    );
    next(error);
  });
};

const cleanupUploadedFiles = async (files = []) => {
  const cleanupPromises = files.map(async (file) => {
    if (!file || !file.path) {
      return;
    }

    try {
      await fs.promises.unlink(file.path);
    } catch (err) {
      if (err.code !== "ENOENT") {
        logger.warn(
          { err, path: file.path },
          "Failed to remove uploaded drawing after validation failure",
        );
      }
    }
  });

  await Promise.all(cleanupPromises);
};

export const createDrawingRequest = async ({
  fullName,
  company,
  email,
  phone,
  notes,
  files,
}) => {
  const normalizedFiles = Array.isArray(files) ? files : [];
  const payload = {
    fullName: typeof fullName === "string" ? fullName.trim() : "",
    company: typeof company === "string" ? company.trim() : "",
    email: typeof email === "string" ? email.trim().toLowerCase() : "",
    phone: typeof phone === "string" ? phone.trim() : "",
    notes: typeof notes === "string" ? notes.trim() : "",
  };

  const errors = [];

  if (
    !payload.fullName ||
    payload.fullName.length < 2 ||
    payload.fullName.length > 100
  ) {
    errors.push({
      field: "fullName",
      message: "Full name is required and must be between 2 and 100 characters",
    });
  }

  if (
    !payload.company ||
    payload.company.length === 0 ||
    payload.company.length > 150
  ) {
    errors.push({
      field: "company",
      message: "Company is required and must not exceed 150 characters",
    });
  }

  if (!payload.phone || !/^\d{7,15}$/.test(payload.phone)) {
    errors.push({
      field: "phone",
      message: "Phone number is required and must contain 7 to 15 digits",
    });
  }

  if (payload.email && !isValidEmail(payload.email)) {
    errors.push({
      field: "email",
      message: "Email must be a valid email address",
    });
  }

  if (normalizedFiles.length === 0) {
    errors.push({
      field: "drawings",
      message: "At least one drawing file is required",
    });
  }

  if (normalizedFiles.length > MAX_FILES) {
    errors.push({
      field: "drawings",
      message: "No more than 5 drawing files are allowed",
    });
  }

  const originalNameSet = new Set();
  normalizedFiles.forEach((file) => {
    const originalName = String(file.originalname || "")
      .trim()
      .toLowerCase();
    if (originalNameSet.has(originalName)) {
      errors.push({
        field: "drawings",
        message: "Duplicate file names are not allowed",
      });
    }
    originalNameSet.add(originalName);
  });

  if (errors.length > 0) {
    await cleanupUploadedFiles(normalizedFiles);
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.errors = errors;
    throw error;
  }

  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const payloadFiles = normalizedFiles.map((file) => {
    const originalName = path.basename(file.originalname || "");
    const extension = getFileExtension(originalName).slice(1);
    const relativePath = path
      .join("uploads", "drawings", year, month, file.filename)
      .replace(/\\/g, "/");

    return {
      originalName,
      storedName: file.filename,
      mimeType: file.mimetype,
      extension,
      size: file.size,
      relativePath,
    };
  });

  try {
    return await DrawingRequest.create({
      fullName: payload.fullName,
      company: payload.company,
      email: payload.email,
      phone: payload.phone,
      notes: payload.notes,
      status: "NEW",
      files: payloadFiles,
    });
  } catch (error) {
    await cleanupUploadedFiles(normalizedFiles);
    throw error;
  }
};

export default { createDrawingRequest };
