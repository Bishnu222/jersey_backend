const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { username, email, password, address } = req.body;

  // Validate required fields
  if (!username || !email || !password || !address) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  // Validate email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

  try {
    // Check if user already exists by username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create new user document
    const newUser = new User({
      username,
      email,
      password: hashedPass,
      address,
    });

    // Save user to database
    await newUser.save();

    return res.status(201).json({ success: true, message: "User Registered" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing email or password" });
  }

  try {
    // Find user by email
    const getUser = await User.findOne({ email });
    if (!getUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare passwords
    const passwordCheck = await bcrypt.compare(password, getUser.password);
    if (!passwordCheck) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Prepare JWT payload
    const payload = {
      _id: getUser._id,
      email: getUser.email,
      username: getUser.username,
      address: getUser.address
    };

    // Sign JWT token
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "7d" });

    // Exclude password from response
    const { password: pwd, ...userData } = getUser._doc;

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      data: userData,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
