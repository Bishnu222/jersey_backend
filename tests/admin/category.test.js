const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const path = require("path");
const fs = require("fs");

const app = require("../../index");
const Category = require("../../models/Category");

let mongoServer;
const imagePath = path.resolve(__dirname, "assets/sample.jpg");

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Ensure the image exists
  if (!fs.existsSync(imagePath)) {
    throw new Error(`❌ sample.jpg is missing at ${imagePath}`);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Category.deleteMany({});
});

describe("Admin Category Management", () => {
  it("should create a category with image", async () => {
    const res = await request(app)
      .post("/api/admin/category")
      .field("name", "Football")
      .attach("image", imagePath);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Football");
    expect(res.body.data.filepath).toBeDefined();
  });

  it("should get all categories", async () => {
    await Category.create({ name: "Basketball" });
    await Category.create({ name: "Cricket" });

    const res = await request(app).get("/api/admin/category");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  it("should get a category by ID", async () => {
    const category = await Category.create({ name: "Tennis" });

    const res = await request(app).get(`/api/admin/category/${category._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Tennis");
  });

  it("should update a category name and image", async () => {
    const category = await Category.create({ name: "OldName" });

    const res = await request(app)
      .put(`/api/admin/category/${category._id}`)
      .field("name", "NewName")
      .attach("image", imagePath);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("NewName");
    expect(res.body.data.filepath).toBeDefined();
  });

  it("should delete a category", async () => {
    const category = await Category.create({ name: "ToDelete" });

    const res = await request(app).delete(`/api/admin/category/${category._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const deleted = await Category.findById(category._id);
    expect(deleted).toBeNull();
  });
});
