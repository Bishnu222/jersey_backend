const express = require("express");
const router = express.Router();
const orderCtrl = require("../controllers/orderController");

router.post("/", orderCtrl.createOrder);
router.get("/", orderCtrl.getAllOrders);
router.get("/user/:userId", orderCtrl.getOrdersByUser);
router.patch("/:orderId", orderCtrl.updateOrderStatus);
router.delete("/:orderId", orderCtrl.deleteOrder);

module.exports = router;
