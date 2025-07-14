const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      name: String,
      quantity: Number,
      price: Number,
      productImage: String,
    }
  ],
  status: {
    type: String,
    enum: ["pending", "processing", "completed"],
    default: "pending",
  },
  total: Number,
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Order", orderSchema);
