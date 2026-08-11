import env from "../config/env.js";
import logger from "../config/logger.js";

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || error.status || 500;

  const payload = {
    success: false,
    message: statusCode === 500 ? "Server error" : error.message,
  };

  if (error.name === "MulterError") {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message:
          error.message || "One or more files exceed the maximum allowed size",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(413).json({
        success: false,
        message: error.message || "Too many files uploaded",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(415).json({
        success: false,
        message: error.message || "Unexpected file upload",
      });
    }

    return res
      .status(400)
      .json({ success: false, message: error.message || "File upload failed" });
  }

  if (!env.isProduction && statusCode === 500 && error.stack) {
    payload.stack = error.stack;
  }

  if (Array.isArray(error.errors) && error.errors.length > 0) {
    payload.errors = error.errors;
  }

  const url = req.originalUrl || "";

  // Ignore browser favicon request
  if (statusCode === 404 && url === "/favicon.ico") {
    return res.sendStatus(204);
  }

  // Missing uploaded images/files are expected sometimes.
  // Return 404 without polluting logs.
  if (statusCode === 404 && url.startsWith("/uploads/")) {
    return res.status(404).json(payload);
  }

  // Log only meaningful errors.
  if (statusCode >= 500) {
    logger.error(
      {
        err: error,
        req: {
          method: req.method,
          url,
        },
      },
      "Unhandled server error",
    );
  } else if (statusCode === 404 && url.startsWith("/api/")) {
    logger.warn(
      {
        req: {
          method: req.method,
          url,
        },
      },
      "API route not found",
    );
  }

  return res.status(statusCode).json(payload);
};

export default errorHandler;
