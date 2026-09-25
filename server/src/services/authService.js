import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { env } from "../config/env.js";
import { AdminUser } from "../models/userModel.js";

/**
 * Generates Access and Refresh tokens for a user
 * @param {import("mongoose").Document|Object} user
 */
function generateTokens(user) {
  const userId = user._id ? user._id.toString() : "65e000000000000000000001";
  const payload = {
    sub: userId,
    email: user.email,
    role: user.role || "admin",
    displayName: user.displayName || "Murtaza Zaman",
    tokenVersion: user.refreshTokenVersion || 0,
  };

  const accessToken = jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  const refreshToken = jwt.sign(
    { sub: userId, tokenVersion: user.refreshTokenVersion || 0 },
    env.refreshTokenSecret,
    { expiresIn: env.refreshTokenExpiresIn }
  );

  return { accessToken, refreshToken };
}

export const authService = {
  async login({ email, password }) {
    const normalizedEmail = (email || "").toLowerCase().trim();
    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await AdminUser.findOne({ email: normalizedEmail });

      // If database is empty or seed user hasn't been created yet, auto-seed default admin
      if (!user && normalizedEmail === "admin@murtazazaman.com" && password === "admin123456") {
        const passwordHash = await bcrypt.hash("admin123456", 10);
        user = await AdminUser.create({
          email: "admin@murtazazaman.com",
          passwordHash,
          displayName: "Murtaza Zaman",
          role: "admin",
          status: "active",
        });
      }
    } else {
      // If DB is offline / not connected, provide development fallback for default admin
      if (normalizedEmail === "admin@murtazazaman.com" && password === "admin123456") {
        user = {
          _id: new mongoose.Types.ObjectId("65e000000000000000000001"),
          email: "admin@murtazazaman.com",
          displayName: "Murtaza Zaman",
          role: "admin",
          status: "active",
          refreshTokenVersion: 0,
          save: async () => {},
        };
      }
    }

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    if (user.status !== "active") {
      const error = new Error("This account is suspended. Please contact the administrator.");
      error.statusCode = 403;
      error.code = "ACCOUNT_SUSPENDED";
      throw error;
    }

    if (user.passwordHash) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        error.code = "INVALID_CREDENTIALS";
        throw error;
      }
    }

    user.lastLoginAt = new Date();
    if (typeof user.save === "function") {
      await user.save();
    }

    const tokens = generateTokens(user);

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
      },
      tokens,
    };
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      const error = new Error("Refresh token is required");
      error.statusCode = 400;
      error.code = "TOKEN_REQUIRED";
      throw error;
    }

    try {
      const decoded = jwt.verify(refreshToken, env.refreshTokenSecret);
      let user = null;

      if (mongoose.connection.readyState === 1) {
        user = await AdminUser.findById(decoded.sub);
        if (!user || user.status !== "active") {
          const error = new Error("User account not found or inactive");
          error.statusCode = 401;
          error.code = "USER_INACTIVE";
          throw error;
        }

        if (user.refreshTokenVersion !== decoded.tokenVersion) {
          const error = new Error("Refresh token has been revoked");
          error.statusCode = 401;
          error.code = "TOKEN_REVOKED";
          throw error;
        }
      } else {
        user = {
          _id: new mongoose.Types.ObjectId(decoded.sub),
          email: "admin@murtazazaman.com",
          displayName: "Murtaza Zaman",
          role: "admin",
          status: "active",
        };
      }

      const tokens = generateTokens(user);
      return {
        user: {
          id: user._id.toString(),
          email: user.email,
          displayName: user.displayName,
          role: user.role,
        },
        tokens,
      };
    } catch (err) {
      const error = new Error("Invalid or expired refresh token");
      error.statusCode = 401;
      error.code = "INVALID_REFRESH_TOKEN";
      throw error;
    }
  },

  async logout(userId) {
    if (mongoose.connection.readyState === 1 && userId) {
      await AdminUser.findByIdAndUpdate(userId, { $inc: { refreshTokenVersion: 1 } });
    }
    return { success: true };
  },

  async getCurrentUser(userId) {
    if (mongoose.connection.readyState === 1) {
      const user = await AdminUser.findById(userId).select("-passwordHash");
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        error.code = "NOT_FOUND";
        throw error;
      }
      return {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
      };
    }

    return {
      id: userId || "65e000000000000000000001",
      email: "admin@murtazazaman.com",
      displayName: "Murtaza Zaman",
      role: "admin",
      lastLoginAt: new Date(),
    };
  },
};

