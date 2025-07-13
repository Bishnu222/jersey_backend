const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded || !decoded._id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user; // attach user info for later middleware/routes
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Access denied, admin only" });
  }
};
