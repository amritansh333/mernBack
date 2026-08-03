import dotenv from "dotenv";

dotenv.config();

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

const validateRequiredEnv = (required) => {
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};

const nodeEnv = getEnv("NODE_ENV", "development");
const isProduction = nodeEnv === "production";
const required = ["MONGO_URI", ...(isProduction ? ["BROCHURE_JWT_SECRET"] : [])];
const corsOrigins = toList(
  getEnv("CORS_ORIGINS") || getEnv("FRONTEND_URL") || getEnv("CLIENT_URL"),
);

if (isProduction && corsOrigins.length === 0) {
  throw new Error(
    "CORS_ORIGINS, FRONTEND_URL, or CLIENT_URL must be set in production",
  );
}

validateRequiredEnv(required);

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
  brochureJwtSecret: getEnv("BROCHURE_JWT_SECRET"),
  brochureSessionCookieName: getEnv(
    "BROCHURE_SESSION_COOKIE_NAME",
    "brochure_session",
  ),
  brochureSessionMaxAgeMs: toNumber(
    getEnv("BROCHURE_SESSION_MAX_AGE_MS"),
    24 * 60 * 60 * 1000,
  ),
  brochureOtpExpiryMinutes: toNumber(getEnv("BROCHURE_OTP_EXPIRY_MINUTES"), 5),
  brochureOtpMaxAttempts: toNumber(getEnv("BROCHURE_OTP_MAX_ATTEMPTS"), 5),
  trustProxy: toNumber(getEnv("TRUST_PROXY"), 1),
  logLevel: getEnv("LOG_LEVEL", isProduction ? "info" : "debug"),
  logRequests: toBoolean(getEnv("LOG_REQUESTS"), true),
});

export default env;
