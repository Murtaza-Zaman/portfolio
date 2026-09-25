import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../src/app.js";

describe("Backend Auth & Security Endpoints", () => {
  it("rejects login with missing credentials", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects unauthorized access to protected admin routes", async () => {
    const res = await request(app).get("/api/v1/admin/projects");
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects invalid JWT token on protected route", async () => {
    const res = await request(app)
      .get("/api/v1/admin/projects")
      .set("Authorization", "Bearer invalid-token-string");
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("INVALID_TOKEN");
  });
});
