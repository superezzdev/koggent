import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    console.log("Database connected to Atlas");
  } catch (error) {
    console.warn(
      "Atlas connection failed (IP not whitelisted or port 27017 blocked):",
      error.message,
    );
    try {
      await mongoose.disconnect();
      console.log("Attempting fallback to local MongoDB...");
      await mongoose.connect(
        process.env.LOCAL_MONGODB_URI || "mongodb://127.0.0.1:27017/agent",
        {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
      });
      console.log("Database connected to local MongoDB successfully");
    } catch (localError) {
      console.error("Local MongoDB connection also failed:", localError.message);
    }
  }
};

export default connectDb;
