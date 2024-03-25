import mongoose from "mongoose";
import config from "../config";

export default async function connectToDatabase() {
  try {
    await mongoose.connect(config.DB_CONNECTION_STRING);
    console.log("Connected to DB");
  } catch (error) {
    console.error(error);
    setTimeout(connectToDatabase, 5000);
  }
}
