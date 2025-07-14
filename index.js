require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// DB Connection
const connectDB = require("./config/jersey_backened");

// Routes
const userRoutes = require("./routes/userRoutes");
const adminUserRoutes = require("./routes/admin/userRouteAdmin");
const adminCategoryRoutes = require("./routes/admin/categoryRouteAdmin");
const adminProductRoutes = require("./routes/admin/productRouteAdmin");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect and Start
connectDB()
  .then(() => {
    console.log("MongoDB connected");

    // API Routes
    app.use("/api/auth", userRoutes);
    app.use("/api/admin/users", adminUserRoutes);
    app.use("/api/admin/category", adminCategoryRoutes);
    app.use("/api/admin/product", adminProductRoutes);
    app.use("/api/orders", orderRoutes);

    // 404 Fallback
    app.use((req, res) => {
      res.status(404).json({ success: false, message: "Route not found" });
    });

    // Global Error Middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
      });
    });

    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
