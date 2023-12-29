import mongoose from "mongoose";
import log from "./logger.js";

async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    log.info(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    log.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;
