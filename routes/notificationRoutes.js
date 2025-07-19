const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Get notifications for a specific user
router.get("/user/:userId", notificationController.getNotificationsByUser);

// Mark a specific notification as read
router.put("/:id/read", notificationController.markAsRead);

module.exports = router;
