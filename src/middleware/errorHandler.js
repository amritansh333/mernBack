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
    message: statusCode === 500 ? "Server error" : error.message,
  };

  if (!env.isProduction && error.stack) {
    payload.stack = error.stack;
  }

  logger.error(
    {
      err: error,
      req: {
        method: req.method,
        url: req.originalUrl,
      },
    },
    "Unhandled request error"
  );

  return res.status(statusCode).json(payload);
};

export default errorHandler;
