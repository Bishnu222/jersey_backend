const User = require("../models/User");
const Order = require("../models/Order");
const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../index");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Order.deleteMany({});
  await User.deleteMany({});
});

describe("Order API", () => {
  let user;

  beforeEach(async () => {
    // Create a user with required fields (including address)
    user = await User.create({
      username: "orderuser",
      email: "orderuser@example.com",
      password: "hashedpassword", // or just plain for test, depends on your logic
      address: "Kathmandu",
    });
  });

  test("should create an order", async () => {
    const orderData = {
      userId: user._id,
      products: [
        {
          name: "Football Jersey",
          quantity: 2,
          price: 100,
          productImage: "jersey.jpg",
        },
      ],
      status: "pending",
      total: 200,
    };

    const res = await request(app).post("/api/orders").send(orderData);
    expect(res.statusCode).toBe(201);
    expect(res.body.userId).toBeDefined();
    expect(res.body.products.length).toBe(1);
  });

  // Similarly add other tests for getAllOrders, getOrdersByUser, updateOrderStatus, deleteOrder
});
