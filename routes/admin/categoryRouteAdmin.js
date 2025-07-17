const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/categoryController');
const upload = require("../../middlewares/fileupload");

// Create category with image upload
router.post('/', upload.single("image"), categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by id
router.get('/:id', categoryController.getCategoryById);

// Update category with optional new image
router.put('/:id', upload.single("image"), categoryController.updateCategory);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
