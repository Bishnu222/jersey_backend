const express = require("express");
const router = express.Router();

const { 
  createUser, 
  getUsers, 
  getOneUser, 
  updateUser, 
  deleteUser 
} = require("../../controllers/admin/usermanagement");

const { authenticateUser, isAdmin } = require("../../middlewares/authorizedUser");

// Apply auth middlewares to all admin user routes
router.use(authenticateUser, isAdmin);

// Create user (admin only)
router.post("/", createUser);

// Get all users (admin only)
router.get("/", getUsers);

// Get one user (admin only)
router.get("/:id", getOneUser);

// Update one user (admin only)
router.put("/:id", updateUser);

// Delete one user (admin only)
router.delete("/:id", deleteUser);

module.exports = router;
