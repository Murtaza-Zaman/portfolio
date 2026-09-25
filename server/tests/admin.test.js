import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../src/app.js";
import { env } from "../src/config/env.js";

function createTestToken(role = "admin") {
  const dummyUserId = new mongoose.Types.ObjectId().toString();
  return jwt.sign(
    {
      sub: dummyUserId,
      email: "admin@murtazazaman.com",
      role,
      displayName: "Murtaza Admin",
      tokenVersion: 1,
    },
    env.jwtSecret,
    { expiresIn: "1h" }
  );
}

describe("Admin CMS & RBAC Endpoints", () => {
  it("rejects unauthorized access without Bearer token", async () => {
    const res = await request(app).get("/api/v1/admin/settings");
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects malformed token", async () => {
    const res = await request(app)
      .get("/api/v1/admin/settings")
      .set("Authorization", "Bearer not-a-real-jwt");
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("INVALID_TOKEN");
  });
});
