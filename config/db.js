import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    isConnected = true;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
