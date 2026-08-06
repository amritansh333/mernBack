import pino from "pino";
import pinoHttp from "pino-http";
import env from "./env.js";

export const logger = pino({
  level: env.logLevel,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers.set-cookie",
      "*.password",
      "*.token",
    ],
    remove: true,
  },
});

export const requestLogger = pinoHttp({
  logger,
  customLogLevel(req, res, error) {
    if (error || res.statusCode >= 500) {
      return "error";
    }

    if (res.statusCode >= 400) {
      return "warn";
    }

    return "info";
  },
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress,
      };
    },
  },
});

// Optional DB persistence for selected logs. Enabled by setting LOG_TO_DB=true in environment.
if (env.logToDb) {
  const persist = (level, obj, msg) => {
    try {
      // Dynamic import of the repository to avoid circular load ordering issues and
      // to keep model persistence inside the admin/system-logs module.
      import("../modules/admin/system-logs/repository.js")
        .then((m) => {
          // repository exposes a create(payload) function that handles persistence
          const repo = m.default || m;

          // Build a document from pino call signature: logger.info(obj, msg)
          let payload = { level, message: undefined, meta: undefined };
          if (typeof obj === "string") {
            payload.message = obj;
            payload.meta = msg ? { msg } : {};
          } else if (obj && typeof obj === "object") {
            payload.meta = obj;
            payload.message = msg || obj.msg || obj.message || "";
          } else {
            payload.message = String(obj ?? msg ?? "");
            payload.meta = {};
          }

          // Ensure repository create exists and call it non-blocking.
          if (typeof repo.create === "function") {
            repo
              .create({
                level: payload.level,
                message: payload.message,
                meta: payload.meta,
                source: "pino",
              })
              .catch(() => {
                // swallow errors to not affect main process
              });
          }
        })
        .catch(() => {
          // ignore dynamic import failure
        });
    } catch (e) {
      // ignore
    }
  };

  const levels = ["info", "warn", "error", "debug", "fatal", "trace"];
  levels.forEach((lvl) => {
    if (typeof logger[lvl] === "function") {
      const orig = logger[lvl].bind(logger);
      logger[lvl] = (...args) => {
        try {
          orig(...args);
        } catch (e) {
          // ignore
        }
        try {
          // args can be (obj, msg) or (msg)
          const [obj, msg] = args;
          persist(lvl, obj, msg);
        } catch (e) {
          // ignore
        }
      };
    }
  });
}

export default logger;
