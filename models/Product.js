const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  team: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  productImage: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
