import dotenv from "dotenv";

dotenv.config();

const required = ["MONGO_URI"];

const getEnv = (key, fallback = "") => process.env[key] || fallback;

const toNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined) {
    return fallback;
  }

  return ["1", "true", "yes"].includes(value.toLowerCase());
};

const toList = (value) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const validateRequiredEnv = () => {
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};

const nodeEnv = getEnv("NODE_ENV", "development");
const isProduction = nodeEnv === "production";
const corsOrigins = toList(
  getEnv("CORS_ORIGINS") || getEnv("FRONTEND_URL") || getEnv("CLIENT_URL"),
);

if (isProduction && corsOrigins.length === 0) {
  throw new Error(
    "CORS_ORIGINS, FRONTEND_URL, or CLIENT_URL must be set in production",
  );
}

validateRequiredEnv();

const env = Object.freeze({
  nodeEnv,
  isProduction,
  port: toNumber(getEnv("PORT"), 5000),
  mongoUri: getEnv("MONGO_URI"),
  baseUrl: getEnv("BASE_URL"),
  corsOrigins,
  bodyLimit: getEnv("BODY_LIMIT", "1mb"),
  rateLimitWindowMs: toNumber(getEnv("RATE_LIMIT_WINDOW_MS"), 15 * 60 * 1000),
  rateLimitMax: toNumber(getEnv("RATE_LIMIT_MAX"), 300),
  trustProxy: toNumber(getEnv("TRUST_PROXY"), 1),
  logLevel: getEnv("LOG_LEVEL", isProduction ? "info" : "debug"),
  logRequests: toBoolean(getEnv("LOG_REQUESTS"), true),
});

export default env;
