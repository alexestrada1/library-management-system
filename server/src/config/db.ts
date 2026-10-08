import mongoose from "mongoose";

async function connectDB() {
  const uri = process.env.MONGO_URI;

  // Stop right away if the setting is missing
  if (!uri) {
    console.error("MONGO_URI is missing from .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // no database means the app can't work, so quit
  }
}

export default connectDB;
