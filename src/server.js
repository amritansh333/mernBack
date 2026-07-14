import mongoose from "mongoose";
import app from "./app.js";
import env from "./config/env.js";
import logger from "./config/logger.js";

mongoose
  .connect(env.mongoUri)
  .then(() => {
    logger.info("MongoDB Connected");

    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });
  })
  .catch((error) => {
    logger.error({ err: error }, "DB Connection Error");
    process.exit(1);
  });
