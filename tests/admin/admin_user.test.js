const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../index");
const User = require("../../models/User");

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

describe("Admin User Management", () => {
  it("creates a user", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .send({
        username: "admincreated",
        email: "admincreated@example.com",
        password: "adminpass",
        address: "Bhaktapur",
        role: "admin"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User created successfully");
  });

  it("gets all users without passwords", async () => {
    await request(app)
      .post("/api/admin/users")
      .send({
        username: "user1",
        email: "user1@example.com",
        password: "pass1234",
        address: "Kathmandu"
      });

    const res = await request(app)
      .get("/api/admin/users");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]).not.toHaveProperty("password");
  });

  it("gets one user by ID without password", async () => {
    await request(app)
      .post("/api/admin/users")
      .send({
        username: "singleuser",
        email: "singleuser@example.com",
        password: "pass123",
        address: "Pokhara"
      });

    const user = await User.findOne({ email: "singleuser@example.com" });

    const res = await request(app)
      .get(`/api/admin/users/${user._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.username).toBe("singleuser");
    expect(res.body.data).not.toHaveProperty("password");
  });

  it("updates a user by ID", async () => {
    await request(app)
      .post("/api/admin/users")
      .send({
        username: "updatableuser",
        email: "updatable@example.com",
        password: "pass123",
        address: "Pokhara"
      });

    const user = await User.findOne({ email: "updatable@example.com" });

    const res = await request(app)
      .put(`/api/admin/users/${user._id}`)
      .send({
        username: "updateduser",
        address: "Lalitpur",
        role: "admin"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User updated");

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.username).toBe("updateduser");
    expect(updatedUser.address).toBe("Lalitpur");
    expect(updatedUser.role).toBe("admin");
  });

  it("deletes a user by ID", async () => {
    await request(app)
      .post("/api/admin/users")
      .send({
        username: "deletableuser",
        email: "deletable@example.com",
        password: "pass123",
        address: "Chitwan"
      });

    const user = await User.findOne({ email: "deletable@example.com" });

    const res = await request(app)
      .delete(`/api/admin/users/${user._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User deleted");

    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });
});
