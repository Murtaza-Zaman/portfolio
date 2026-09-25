import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { env } from "../config/env.js";
import { AdminUser } from "../models/userModel.js";

/**
 * Middleware to authenticate requests via JWT Bearer token
 */
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication token is required to access this resource",
      },
    });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await AdminUser.findById(decoded.sub).select("-passwordHash");
      if (!user || user.status !== "active") {
        return res.status(401).json({
          data: null,
          error: {
            code: "USER_INACTIVE_OR_NOT_FOUND",
            message: "User account is suspended or no longer exists",
          },
        });
      }

      if (decoded.tokenVersion && user.refreshTokenVersion !== decoded.tokenVersion) {
        return res.status(401).json({
          data: null,
          error: {
            code: "TOKEN_REVOKED",
            message: "Session has expired or been revoked. Please log in again.",
          },
        });
      }
    } else {
      // If DB is offline / test environment fallback
      user = {
        _id: decoded.sub,
        email: decoded.email || "test@example.com",
        role: decoded.role || "admin",
        displayName: decoded.displayName || "Test User",
        status: "active",
      };
    }

    req.user = user;
    next();
  } catch (error) {
    const isExpired = error.name === "TokenExpiredError";
    return res.status(401).json({
      data: null,
      error: {
        code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
        message: isExpired ? "Authentication token has expired" : "Invalid authentication token",
      },
    });
  }
}

/**
 * Middleware to restrict access based on user role
 * @param {string[]} allowedRoles
 */
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        data: null,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        data: null,
        error: {
          code: "FORBIDDEN",
          message: `Access denied. Requires one of the following roles: ${allowedRoles.join(", ")}`,
        },
      });
    }

    next();
  };
}
