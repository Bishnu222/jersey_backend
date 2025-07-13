require("dotenv").config();

const express = require("express");
const connectJERSEY_BACKENED = require("./config/jersey_backened");
const userRoutes = require("./routes/userRoutes");
const adminUserRoutes = require("./routes/admin/userRouteAdmin");
const adminCategoryRoutes = require("./routes/admin/categoryRouteAdmin");
const adminProductRoutes = require("./routes/admin/productRouteAdmin");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectJERSEY_BACKENED()
  .then(() => {
    console.log("MongoDB connected");

    // Routes
    app.use("/api/auth", userRoutes);
    app.use("/api/admin/users", adminUserRoutes);           // e.g., /api/admin/users/:id
    app.use("/api/admin/category", adminCategoryRoutes);
    app.use("/api/admin/product", adminProductRoutes);

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ success: false, message: "Route not found" });
    });

    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
