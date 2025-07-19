const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["order", "promotion", "alert"],
      default: "order",
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Compound index for querying notifications by user and read status efficiently
notificationSchema.index({ userId: 1, read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
