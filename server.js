require("dotenv").config();
const app = require("./index");
const connectJERSEY_BACKENED = require("./config/jersey_backened");

const PORT = process.env.PORT || 5050;

connectJERSEY_BACKENED()
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);  // Exit if DB connection fails
  });
