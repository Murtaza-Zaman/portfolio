import { Router } from "express";

import { authController } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

export const authRouter = Router();

authRouter.post("/login", authLimiter, authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authenticateToken, authController.logout);
authRouter.get("/me", authenticateToken, authController.me);
