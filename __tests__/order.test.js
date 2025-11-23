const request = require("supertest");
const app = require("../app");
const User = require("../model/User");
const Order = require("../model/Order");
const mongoose = require("mongoose");

jest.setTimeout(30000); // Set timeout to 30 seconds

describe("Order Management Tests", () => {
  let authToken;
  let testUser;

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

    // Create a test user and login
    const testEmail = `ordertest${Date.now()}@example.com`;
    const signupRes = await request(app).post("/signup").send({
      name: "Order Test User",
      email: testEmail,
      password: "password123",
    });

    testUser = signupRes.body.user;

    // Extract the JWT cookie
    const loginRes = await request(app).post("/login").send({
      email: testEmail,
      password: "password123",
    });

    const cookies = loginRes.headers["set-cookie"];
    authToken = cookies
      .find((cookie) => cookie.startsWith("jwt="))
      .split(";")[0];
  });

  afterAll(async () => {
    // Clean up test data
    await Order.deleteMany({ owner: /Order Test User/i });
    await User.deleteMany({ email: { $regex: /ordertest.*@example\.com/ } });
    await mongoose.connection.close();
  });

  describe("POST /make-order", () => {
    it("should create a new order when authenticated", async () => {
      const res = await request(app)
        .post("/make-order")
        .set("Cookie", authToken)
        .send({
          name: "Order Test User",
          restaurant: "Test Restaurant",
          food: "Test Food",
          drink: "Test Drink",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("order");
      expect(res.body.order.restaurant).toBe("Test Restaurant");
    });

    it("should return error when not authenticated", async () => {
      const res = await request(app).post("/make-order").send({
        name: "Order Test User",
        restaurant: "Test Restaurant",
        food: "Test Food",
        drink: "Test Drink",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /get-orders", () => {
    beforeAll(async () => {
      // Create some test orders
      await request(app).post("/make-order").set("Cookie", authToken).send({
        name: "Order Test User",
        restaurant: "Restaurant 1",
        food: "Food 1",
        drink: "Drink 1",
      });
    });

    it("should retrieve user orders when authenticated", async () => {
      const res = await request(app)
        .get("/get-orders")
        .set("Cookie", authToken);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("should return error when not authenticated", async () => {
      const res = await request(app).get("/get-orders");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("PATCH /edit-order", () => {
    let orderId;

    beforeAll(async () => {
      // Create an order to edit
      const orderRes = await request(app)
        .post("/make-order")
        .set("Cookie", authToken)
        .send({
          name: "Order Test User",
          restaurant: "Original Restaurant",
          food: "Original Food",
          drink: "Original Drink",
        });

      orderId = orderRes.body.order._id;
    });

    it("should update an existing order", async () => {
      const res = await request(app)
        .patch("/edit-order")
        .set("Cookie", authToken)
        .send({
          id: orderId,
          restaurant: "Updated Restaurant",
          food: "Updated Food",
          drink: "Updated Drink",
        });

      expect(res.statusCode).toBe(200);
    });
  });

  describe("DELETE /delete-order", () => {
    let orderId;

    beforeAll(async () => {
      // Create an order to delete
      const orderRes = await request(app)
        .post("/make-order")
        .set("Cookie", authToken)
        .send({
          name: "Order Test User",
          restaurant: "Delete Restaurant",
          food: "Delete Food",
          drink: "Delete Drink",
        });

      orderId = orderRes.body.order._id;
    });

    it("should delete an existing order", async () => {
      const res = await request(app)
        .delete("/delete-order")
        .set("Cookie", authToken)
        .send({ id: orderId });

      expect(res.statusCode).toBe(200);
    });
  });
});
