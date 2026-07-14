import mongoose from "mongoose";
import env from "./env.js";
import logger from "./logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info("MongoDB Connected");
  } catch (error) {
    logger.error({ err: error }, "MongoDB Error");
    process.exit(1);
  }
};

export default connectDB;
