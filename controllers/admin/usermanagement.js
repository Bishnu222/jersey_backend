const User = require("../../models/User");
const bcrypt = require("bcrypt");

// 1. Create User (Admin)
exports.createUser = async (req, res) => {
  const { username, email, password, address, role } = req.body;

  if (!username || !email || !password || !address) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Username or email already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const userRole = role && (role === 'admin' || role === 'user') ? role : 'user';

    const newUser = new User({
      username,
      email,
      password: hashedPass,
      address,
      role: userRole
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error("Create User Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 2. Get All Users (exclude password)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ success: true, message: "All users", data: users });
  } catch (err) {
    console.error("Get Users Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3. Get One User by ID (exclude password)
exports.getOneUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, message: "User found", data: user });
  } catch (err) {
    console.error("Get One User Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 4. Update User by ID
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { username, address, role } = req.body;

  try {
    await User.updateOne(
      { _id: id },
      {
        $set: {
          username,
          address,
          role
        }
      }
    );
    return res.status(200).json({ success: true, message: "User updated" });
  } catch (err) {
    console.error("Update User Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 5. Delete User by ID
exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await User.deleteOne({ _id: id });
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("Delete User Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
