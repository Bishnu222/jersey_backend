const express = require('express');
const router = express.Router();

// Dummy implementation for eSewa payment initiation
router.post('/create-payment', (req, res) => {
  const { amount } = req.body;
  // In a real app, generate a payment URL with eSewa API here
  // For now, just return a dummy URL for testing
  if (!amount) {
    return res.status(400).json({ success: false, message: "Amount is required" });
  }
  return res.json({ url: "https://esewa.com.np/#/home" });
});

module.exports = router; 