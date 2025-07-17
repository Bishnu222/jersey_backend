const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const path = require("path");
const fs = require("fs");

const app = require("../../index"); // Your Express app
const Product = require("../../models/Product");
const Category = require("../../models/Category");

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
  await Product.deleteMany({});
  await Category.deleteMany({});
});

describe("Product API", () => {
  const sampleImagePath = path.resolve(__dirname, "assets/sample.jpg");

  it("should have sample image file", () => {
    expect(fs.existsSync(sampleImagePath)).toBe(true);
  });

  it("should create a product with image upload", async () => {
    const category = await Category.create({ name: "Test Category" });

    const res = await request(app)
      .post("/api/admin/product")
      .field("team", "Barcelona")
      .field("type", "Home")
      .field("size", "M")
      .field("price", "100")
      .field("categoryId", category._id.toString())
      .attach("productImage", sampleImagePath);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.team).toBe("Barcelona");
    expect(res.body.data.type).toBe("Home");
    expect(res.body.data.size).toBe("M");
    expect(res.body.data.price).toBe(100);
    expect(res.body.data.productImage).toBeDefined();
  });

  it("should fetch products with pagination", async () => {
    const category = await Category.create({ name: "Test Category" });

    for (let i = 1; i <= 15; i++) {
      await Product.create({
        team: "Team" + i,
        type: "Home",
        size: "M",
        price: 50 + i,
        categoryId: category._id,
        productImage: "dummy.jpg",
      });
    }

    const res = await request(app)
      .get("/api/admin/product")
      .query({ page: 2, limit: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(5);
    expect(res.body.pagination.page).toBe(2);
    expect(res.body.pagination.limit).toBe(5);
    expect(res.body.pagination.total).toBe(15);
    expect(res.body.pagination.totalPages).toBe(3);
  });

  it("should return error if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/admin/product")
      .field("team", "")
      .attach("productImage", sampleImagePath);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Missing required fields");
  });

  it("should return error for invalid price", async () => {
    const category = await Category.create({ name: "Test Category" });

    const res = await request(app)
      .post("/api/admin/product")
      .field("team", "TeamX")
      .field("type", "Home")
      .field("size", "M")
      .field("price", "-10")
      .field("categoryId", category._id.toString())
      .attach("productImage", sampleImagePath);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Price must be a positive number");
  });

  it("should return error for invalid 'type' enum value", async () => {
    const category = await Category.create({ name: "Test Category" });

    const res = await request(app)
      .post("/api/admin/product")
      .field("team", "TeamX")
      .field("type", "InvalidType")
      .field("size", "M")
      .field("price", "50")
      .field("categoryId", category._id.toString())
      .attach("productImage", sampleImagePath);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("is not a valid enum value");
  });

  it("should return error for invalid 'size' enum value", async () => {
    const category = await Category.create({ name: "Test Category" });

    const res = await request(app)
      .post("/api/admin/product")
      .field("team", "TeamX")
      .field("type", "Home")
      .field("size", "XXL")
      .field("price", "50")
      .field("categoryId", category._id.toString())
      .attach("productImage", sampleImagePath);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("is not a valid enum value");
  });

  it("should filter products by search query", async () => {
    const category = await Category.create({ name: "Test Category" });

    await Product.create({
      team: "Manchester United",
      type: "Home",
      size: "L",
      price: 100,
      categoryId: category._id,
      productImage: "dummy.jpg",
    });

    await Product.create({
      team: "Chelsea",
      type: "Away",
      size: "M",
      price: 90,
      categoryId: category._id,
      productImage: "dummy.jpg",
    });

    const res = await request(app)
      .get("/api/admin/product")
      .query({ search: "Chelsea" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].team).toBe("Chelsea");
  });

  it("should return error when uploading a non-image file", async () => {
    const category = await Category.create({ name: "Test Category" });

    const nonImagePath = path.resolve(__dirname, "assets/sample.txt");

    // Create dummy txt file if not exists
    if (!fs.existsSync(nonImagePath)) {
      fs.writeFileSync(nonImagePath, "This is a test text file");
    }

    const res = await request(app)
      .post("/api/admin/product")
      .field("team", "TeamX")
      .field("type", "Home")
      .field("size", "M")
      .field("price", "50")
      .field("categoryId", category._id.toString())
      .attach("productImage", nonImagePath);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Uploaded file must be an image");
  });

  it("should return error when no image is uploaded", async () => {
    const category = await Category.create({ name: "Test Category" });

    const res = await request(app)
      .post("/api/admin/product")
      .field("team", "TeamX")
      .field("type", "Home")
      .field("size", "M")
      .field("price", "50")
      .field("categoryId", category._id.toString());

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Missing required fields");
  });
});
