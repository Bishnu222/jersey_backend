const Category = require('../../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const filename = req.file?.path; // multer file path
    const category = new Category({ name: req.body.name, filepath: filename });
    await category.save();
    return res.status(201).json({
      success: true,
      message: "Created",
      data: category,
    });
  } catch (err) {
    console.error("Create category error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.json({ success: true, data: categories, message: "All categories" });
  } catch (err) {
    console.error("Get all categories error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, data: category, message: "One category" });
  } catch (err) {
    console.error("Get category by id error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update category (with optional image update)
exports.updateCategory = async (req, res) => {
  try {
    const updateData = { name: req.body.name };
    if (req.file) {
      updateData.filepath = req.file.path;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    return res.json({ success: true, data: category, message: "Updated" });
  } catch (err) {
    console.error("Update category error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const result = await Category.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    console.error("Delete category error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
