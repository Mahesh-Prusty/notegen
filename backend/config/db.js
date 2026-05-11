import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected...");
  } catch (error) {
    console.error("Database Connection Error:", error.message);
    process.exit(1); // FIX: exit if DB fails — server is useless without it
  }
};

export default connectDB;