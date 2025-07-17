const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productController = require("../../controllers/admin/productmanagement");

// Configure multer storage for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure 'uploads' folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/", upload.single("productImage"), productController.createProduct);
router.get("/", productController.getProducts);
router.delete("/:id", productController.deleteProduct);
router.put("/:id", upload.single("productImage"), productController.updateProduct);

module.exports = router;
