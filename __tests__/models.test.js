const mongoose = require("mongoose");
const User = require("../model/User");
const Order = require("../model/Order");
const Menu = require("../model/Menu");

jest.setTimeout(30000); // Set timeout to 30 seconds

describe("Model Tests", () => {
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
    await User.deleteMany({ email: { $regex: /modeltest.*@example\.com/ } });
    await Order.deleteMany({ owner: /Model Test/ });
    await Menu.deleteMany({ restaurant: /Model Test/ });
    await mongoose.connection.close();
  });

  describe("User Model", () => {
    it("should create a valid user", async () => {
      const user = new User({
        name: "Model Test User",
        email: `modeltest${Date.now()}@example.com`,
        password: "password123",
      });

      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe("model test user");
      expect(savedUser.roles).toBe("User");
    });

    it("should hash password before saving", async () => {
      const user = new User({
        name: "Hash Test User",
        email: `modeltest${Date.now()}@example.com`,
        password: "password123",
      });

      await user.save();

      expect(user.password).not.toBe("password123");
      expect(user.password.length).toBeGreaterThan(20);
    });

    it("should reject invalid email", async () => {
      const user = new User({
        name: "Invalid Email User",
        email: "invalidemail",
        password: "password123",
      });

      await expect(user.save()).rejects.toThrow();
    });

    it("should reject short password", async () => {
      const user = new User({
        name: "Short Password User",
        email: `modeltest${Date.now()}@example.com`,
        password: "123",
      });

      await expect(user.save()).rejects.toThrow();
    });

    it("should reject duplicate email", async () => {
      const email = `modeltest${Date.now()}@example.com`;

      const user1 = new User({
        name: "First User",
        email: email,
        password: "password123",
      });
      await user1.save();

      const user2 = new User({
        name: "Second User",
        email: email,
        password: "password456",
      });

      await expect(user2.save()).rejects.toThrow();
    });

    it("should set default role to User", async () => {
      const user = new User({
        name: "Default Role User",
        email: `modeltest${Date.now()}@example.com`,
        password: "password123",
      });

      const savedUser = await user.save();

      expect(savedUser.roles).toBe("User");
    });

    it("should allow Admin role", async () => {
      const user = new User({
        name: "Admin User",
        email: `modeltest${Date.now()}@example.com`,
        password: "password123",
        roles: "Admin",
      });

      const savedUser = await user.save();

      expect(savedUser.roles).toBe("Admin");
    });
  });

  describe("Order Model", () => {
    it("should create a valid order", async () => {
      const order = new Order({
        owner: "Model Test Owner",
        restaurant: "Model Test Restaurant",
        food: "Test Food",
        drink: "Test Drink",
      });

      const savedOrder = await order.save();

      expect(savedOrder._id).toBeDefined();
      expect(savedOrder.owner).toBe("Model Test Owner");
      expect(savedOrder.restaurant).toBe("Model Test Restaurant");
    });

    it("should require owner field", async () => {
      const order = new Order({
        restaurant: "Test Restaurant",
        food: "Test Food",
        drink: "Test Drink",
      });

      await expect(order.save()).rejects.toThrow();
    });
  });

  describe("Menu Model", () => {
    it("should create a valid menu item", async () => {
      const menu = new Menu({
        restaurant: "Model Test Restaurant",
        food: "Test Food",
        drink: "Test Drink",
      });

      const savedMenu = await menu.save();

      expect(savedMenu._id).toBeDefined();
      expect(savedMenu.restaurant).toBe("Model Test Restaurant");
    });

    it("should require restaurant field", async () => {
      const menu = new Menu({
        food: "Test Food",
        drink: "Test Drink",
      });

      await expect(menu.save()).rejects.toThrow();
    });
  });
});
