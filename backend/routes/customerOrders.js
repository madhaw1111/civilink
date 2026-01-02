const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");

// GET logged-in customer's orders
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      "customer.user": req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (err) {
    console.error("CUSTOMER ORDERS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
});

module.exports = router;
