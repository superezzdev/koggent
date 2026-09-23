import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log("Database connected to Atlas");
  } catch (error) {
    console.warn("Atlas connection failed (port 27017 may be blocked by network):", error.message);
    try {
      console.log("Attempting fallback to local MongoDB...");
      await mongoose.connect("mongodb://localhost:27017/billing", {
        serverSelectionTimeoutMS: 3000,
      });
      console.log("Database connected to local MongoDB successfully");
    } catch (localError) {
      console.error("Local MongoDB connection also failed:", localError.message);
    }
  }
};

export default connectDb;
