const express = require("express")
const router = express.Router()
const productController = require("../../controllers/admin/productmanagement")

router.post(
    "/",
    productController.createProduct // using dot, get function
)
router.get(
    "/",
    productController.getProducts
)
module.exports = router