const mongoose = require("mongoose");

const connectJERSEY_BACKENED = async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/jersey");
};

module.exports = connectJERSEY_BACKENED; 