const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getOneUser,
  updateUser,
  deleteUser,
} = require("../../controllers/admin/usermanagement");

// Admin CRUD Routes
router.post("/", createUser);               // Create user
router.get("/", getUsers);                  // Get all users
router.get("/:id", getOneUser);             // Get single user
router.put("/:id", updateUser);             // Update user info
router.delete("/:id", deleteUser);          // Delete user

module.exports = router;
