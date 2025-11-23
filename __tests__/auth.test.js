const request = require("supertest");
const app = require("../app");
const User = require("../model/User");
const mongoose = require("mongoose");

jest.setTimeout(30000); // Set timeout to 30 seconds

describe("Authentication Tests", () => {
  beforeAll(async () => {
    // Wait for database connection with timeout
    if (mongoose.connection.readyState === 0) {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Database connection timeout"));
        }, 10000);

        mongoose.connection.once("connected", () => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ email: { $regex: /test.*@example\.com/ } });
    await mongoose.connection.close();
  });

  describe("POST /signup", () => {
    it("should create a new user with valid credentials", async () => {
      const res = await request(app)
        .post("/signup")
        .send({
          name: "Test User",
          email: `test${Date.now()}@example.com`,
          password: "password123",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("user");
    });

    it("should return error for invalid email", async () => {
      const res = await request(app).post("/signup").send({
        name: "Test User",
        email: "invalidemail",
        password: "password123",
      });

      expect(res.statusCode).toBe(400);
    });

    it("should return error for short password", async () => {
      const res = await request(app)
        .post("/signup")
        .send({
          name: "Test User",
          email: `test${Date.now()}@example.com`,
          password: "123",
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /login", () => {
    let testEmail;

    beforeAll(async () => {
      // Create a test user
      testEmail = `testlogin${Date.now()}@example.com`;
      await request(app).post("/signup").send({
        name: "Test Login User",
        email: testEmail,
        password: "password123",
      });
    });

    it("should login with correct credentials", async () => {
      const res = await request(app).post("/login").send({
        email: testEmail,
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should return error for incorrect password", async () => {
      const res = await request(app).post("/login").send({
        email: testEmail,
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(400);
    });

    it("should return error for non-existent user", async () => {
      const res = await request(app).post("/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /logout", () => {
    it("should clear the JWT cookie", async () => {
      const res = await request(app).get("/logout");

      expect(res.statusCode).toBe(200);
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });
});
