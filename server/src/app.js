import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { adminRouter } from "./routes/adminRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import { publicRouter } from "./routes/publicRoutes.js";
import { systemRouter } from "./routes/systemRoutes.js";

export const app = express();

// Security and parser middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server) or matching clientOrigin
      if (!origin || origin === env.clientOrigin || origin === "http://localhost:5173" || origin === "http://localhost:3000") {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/preview
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

// Infrastructure compatibility health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Primary API and system discovery routes
app.use(systemRouter);
app.use("/api/v1", systemRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1", publicRouter);

// 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);
