const express = require('express');
const router = express.Router();
// const {createCategory} = require('../../controllers/admin/categorymanagement');
const categoryController = require('../../controllers/admin/categoryController');
// can be implemented using single import
const upload = require("../../middlewares/fileupload")

// implement using dot function
router.post(
    '/', 
    upload.single("image"),
    // req.file, req.files from next function
    // get image, file metadata
    categoryController.createCategory
);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id',upload.single("image") ,categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;