// const express = require("express")
// const router = express.Router()
// const productController = require("../../controllers/admin/productmanagement")

// router.post(
//     "/",
//     productController.createProduct // using dot, get function
// )
// router.get(
//     "/",
//     productController.getProducts
// )
// module.exports = router

const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../../controllers/admin/productmanagement");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST route for creating a product with image upload
router.post("/", upload.single("productImage"), productController.createProduct);

// GET route for fetching products
router.get("/", productController.getProducts);

module.exports = router;
