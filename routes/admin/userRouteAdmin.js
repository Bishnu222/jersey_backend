const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser
} = require("../../controllers/admin/usermanagement");

const { authenticateUser, isAdmin } = require("../../middlewares/authorizedUser");

// Protected route: only accessible by authenticated admins
router.get("/users", authenticateUser, isAdmin, getUsers);

//  Common CRUD routes
router.get("/", getUsers);              // GET all users (public or temp test route)
router.post("/create", createUser);     // POST create new user
router.get("/:id", getOneUser);         // GET one user by ID
router.put("/:id", updateOneUser);      // PUT update user by ID
router.delete("/:id", deleteOneUser);   // DELETE user by ID

module.exports = router;
