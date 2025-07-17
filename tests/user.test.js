const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../index");
const User = require("../models/User");

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
  await User.deleteMany({});
});

describe("User Registration & Login", () => {
  it("registers a user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
        address: "Kathmandu"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User Registered");
  });

  it("does not register user with duplicate username or email", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
        address: "Kathmandu"
      });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password456",
        address: "Kathmandu"
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("logs in successfully with correct credentials", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "loginuser",
        email: "loginuser@example.com",
        password: "mypassword",
        address: "Pokhara"
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "loginuser@example.com",
        password: "mypassword"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data.email).toBe("loginuser@example.com");
    expect(res.body.data.password).toBeUndefined();
  });

  it("fails login with incorrect password", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "failuser",
        email: "failuser@example.com",
        password: "rightpassword",
        address: "Lalitpur"
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "failuser@example.com",
        password: "wrongpassword"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
