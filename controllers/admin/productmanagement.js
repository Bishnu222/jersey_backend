const Product = require("../../models/Product");
const Notification = require("../../models/Notification");
const User = require("../../models/User");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { team, type, size, price, quantity, categoryId } = req.body;
    const file = req.file;

    if (!team || !type || !size || !price || !quantity || !categoryId || !file) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ success: false, message: "Uploaded file must be an image" });
    }

    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({ success: false, message: "Price must be a positive number" });
    }

    if (isNaN(quantity) || Number(quantity) < 0) {
      return res.status(400).json({ success: false, message: "Quantity must be a non-negative number" });
    }

    const sellerId = req.user?.id || req.body.sellerId || null;

    const productData = {
      team,
      type,
      size,
      price: Number(price),
      quantity: Number(quantity),
      categoryId,
      sellerId,
      productImage: file.filename,
    };

    const product = new Product(productData);
    await product.save();

    // Notify all users (not admins) about the new product
    const users = await User.find({ role: "user" }, "_id");
    const notifications = users.map((user) => ({
      userId: user._id,
      message: `A new product has been added: ${product.team || product.name || "New Jersey"}`,
      type: "promotion",
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    return res.status(201).json({ success: true, message: "Product saved successfully", data: product });
  } catch (err) {
    console.error("createProduct error:", err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get products with pagination and search
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { team: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { size: { $regex: search, $options: "i" } },
      ];
    }

    const skips = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate("categoryId", "name")
      .skip(Number(skips))
      .limit(Number(limit))
      .exec();

    const total = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("getProducts error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId', 'name');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete product by id
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("deleteProduct error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update product by id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { team, type, size, price, quantity, categoryId } = req.body;
    const file = req.file;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (team !== undefined) product.team = team;
    if (type !== undefined) product.type = type;
    if (size !== undefined) product.size = size;

    if (price !== undefined) {
      if (isNaN(price) || Number(price) <= 0) {
        return res.status(400).json({ success: false, message: "Price must be a positive number" });
      }
      product.price = Number(price);
    }

    if (quantity !== undefined) {
      if (isNaN(quantity) || Number(quantity) < 0) {
        return res.status(400).json({ success: false, message: "Quantity must be a non-negative number" });
      }
      product.quantity = Number(quantity);
    }

    if (categoryId !== undefined) product.categoryId = categoryId;

    if (file) {
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ success: false, message: "Uploaded file must be an image" });
      }
      product.productImage = file.filename;
    }

    await product.save();

    return res.status(200).json({ success: true, message: "Product updated successfully", data: product });
  } catch (err) {
    console.error("updateProduct error:", err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
