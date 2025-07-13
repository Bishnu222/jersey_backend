const mongoose = require("mongoose");
const CONNECTION_STRING = process.env.MONGODB_URL;

const connectJERSEY_BACKENED = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("JERSEY_BACKENED Err", err);
  }
};

module.exports = connectJERSEY_BACKENED;
