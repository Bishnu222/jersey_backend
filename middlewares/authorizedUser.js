const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware: Authenticates any logged-in user
exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'

    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded?._id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user; // Attach the user to the request object
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

// Middleware: Restricts access to admin users only
exports.isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Access denied, admin only" });
};
