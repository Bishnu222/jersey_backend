require("dotenv").config();

const express = require("express");
const userRoutes = require("./routes/userRoutes");
const adminUserRoutes = require("./routes/admin/userRouteAdmin");
const adminCategoryRoutes = require("./routes/admin/categoryRouteAdmin");
const adminProductRoutes = require("./routes/admin/productRouteAdmin");
const orderRoutes = require("./routes/orderRoutes");
const esewaRoutes = require("./routes/esewaRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const path = require("path");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", userRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/category", adminCategoryRoutes);
app.use("/api/admin/product", adminProductRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/esewa", esewaRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

module.exports = app;
