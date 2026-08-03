import cors from "cors";
import env from "./env.js";

const developmentOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:8080",
];

const allowedOrigins = env.isProduction
  ? env.corsOrigins
  : [...new Set([...env.corsOrigins, ...developmentOrigins])];

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Cache-Control", "Pragma"],
};

export const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
