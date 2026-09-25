import mongoose from "mongoose";

import { env } from "./env.js";

// Disable command buffering so operations fail fast if DB is disconnected
mongoose.set("bufferCommands", false);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established successfully.");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB connection disconnected.");
});

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  return mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}

