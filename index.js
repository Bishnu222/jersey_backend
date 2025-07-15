require("dotenv").config();

const express = require("express");
const connectJERSEY_BACKENED = require("./config/jersey_backened");
const userRoutes = require("./routes/userRoutes");
const adminUserRoutes = require("./routes/admin/userRouteAdmin");
const adminCategoryRoutes = require("./routes/admin/categoryRouteAdmin");
const adminProductRoutes = require("./routes/admin/productRouteAdmin");
const orderRoutes = require("./routes/orderRoutes");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to DB and start server
connectJERSEY_BACKENED()
  .then(() => {
    console.log("✅ MongoDB connected");

    // API routes
    app.use("/api/auth", userRoutes);
    app.use("/api/admin/users", adminUserRoutes);
    app.use("/api/admin/category", adminCategoryRoutes);
    app.use("/api/admin/product", adminProductRoutes);
    app.use("/api/orders", orderRoutes);

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ success: false, message: "Route not found" });
    });
  })


module.exports = app;
