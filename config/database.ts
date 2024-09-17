import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connect Success!");
  } catch (error) {
    console.error("Connect Error!", error);
  }
};
