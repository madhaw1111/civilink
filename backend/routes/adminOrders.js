const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const Order = require("../models/Order");

// GET all orders (admin only)
router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("ADMIN ORDERS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
});

module.exports = router;
