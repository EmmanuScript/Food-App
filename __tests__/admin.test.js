const request = require("supertest");
const app = require("../app");
const User = require("../model/User");
const Menu = require("../model/Menu");
const mongoose = require("mongoose");

jest.setTimeout(30000); // Set timeout to 30 seconds

describe("Admin Functions Tests", () => {
  let adminToken;
  let userToken;

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

    // Create an admin user
    const adminEmail = `admin${Date.now()}@example.com`;
    const admin = await User.create({
      name: "Admin User",
      email: adminEmail,
      password: "adminpass123",
      roles: "Admin",
    });

    const adminLoginRes = await request(app).post("/login").send({
      email: adminEmail,
      password: "adminpass123",
    });

    const adminCookies = adminLoginRes.headers["set-cookie"];
    adminToken = adminCookies
      .find((cookie) => cookie.startsWith("jwt="))
      .split(";")[0];

    // Create a regular user
    const userEmail = `user${Date.now()}@example.com`;
    await request(app).post("/signup").send({
      name: "Regular User",
      email: userEmail,
      password: "userpass123",
    });

    const userLoginRes = await request(app).post("/login").send({
      email: userEmail,
      password: "userpass123",
    });

    const userCookies = userLoginRes.headers["set-cookie"];
    userToken = userCookies
      .find((cookie) => cookie.startsWith("jwt="))
      .split(";")[0];
  });

  afterAll(async () => {
    // Clean up test data
    await Menu.deleteMany({ restaurant: /Test.*Restaurant/ });
    await User.deleteMany({ email: { $regex: /(admin|user).*@example\.com/ } });
    await mongoose.connection.close();
  });

  describe("POST /create-menu (Admin only)", () => {
    it("should allow admin to create menu items", async () => {
      const res = await request(app)
        .post("/create-menu")
        .set("Cookie", adminToken)
        .send({
          restaurant: "Test Admin Restaurant",
          food: "Admin Food",
          drink: "Admin Drink",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("menu");
    });

    it("should deny regular user from creating menu items", async () => {
      const res = await request(app)
        .post("/create-menu")
        .set("Cookie", userToken)
        .send({
          restaurant: "Test User Restaurant",
          food: "User Food",
          drink: "User Drink",
        });

      expect(res.statusCode).toBe(403);
    });

    it("should deny unauthenticated users", async () => {
      const res = await request(app).post("/create-menu").send({
        restaurant: "Test Restaurant",
        food: "Food",
        drink: "Drink",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /get-menu", () => {
    beforeAll(async () => {
      // Create some menu items
      await request(app).post("/create-menu").set("Cookie", adminToken).send({
        restaurant: "Test Menu Restaurant",
        food: "Menu Food",
        drink: "Menu Drink",
      });
    });

    it("should retrieve all menu items", async () => {
      const res = await request(app).get("/get-menu").set("Cookie", adminToken);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /get-all-orders (Admin only)", () => {
    it("should allow admin to view all orders", async () => {
      const res = await request(app)
        .get("/get-all-orders")
        .set("Cookie", adminToken);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should deny regular users", async () => {
      const res = await request(app)
        .get("/get-all-orders")
        .set("Cookie", userToken);

      expect(res.statusCode).toBe(403);
    });
  });

  describe("PATCH /edit-menu (Admin only)", () => {
    let menuId;

    beforeAll(async () => {
      const menuRes = await request(app)
        .post("/create-menu")
        .set("Cookie", adminToken)
        .send({
          restaurant: "Edit Test Restaurant",
          food: "Original Food",
          drink: "Original Drink",
        });

      menuId = menuRes.body.menu._id;
    });

    it("should allow admin to edit menu items", async () => {
      const res = await request(app)
        .patch("/edit-menu")
        .set("Cookie", adminToken)
        .send({
          id: menuId,
          restaurant: "Updated Restaurant",
          food: "Updated Food",
          drink: "Updated Drink",
        });

      expect(res.statusCode).toBe(200);
    });

    it("should deny regular users", async () => {
      const res = await request(app)
        .patch("/edit-menu")
        .set("Cookie", userToken)
        .send({
          id: menuId,
          restaurant: "Hacked Restaurant",
          food: "Hacked Food",
          drink: "Hacked Drink",
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe("DELETE /delete-menu (Admin only)", () => {
    let menuId;

    beforeAll(async () => {
      const menuRes = await request(app)
        .post("/create-menu")
        .set("Cookie", adminToken)
        .send({
          restaurant: "Delete Test Restaurant",
          food: "Delete Food",
          drink: "Delete Drink",
        });

      menuId = menuRes.body.menu._id;
    });

    it("should allow admin to delete menu items", async () => {
      const res = await request(app)
        .delete("/delete-menu")
        .set("Cookie", adminToken)
        .send({ id: menuId });

      expect(res.statusCode).toBe(200);
    });

    it("should deny regular users", async () => {
      const res = await request(app)
        .delete("/delete-menu")
        .set("Cookie", userToken)
        .send({ id: menuId });

      expect(res.statusCode).toBe(403);
    });
  });
});
