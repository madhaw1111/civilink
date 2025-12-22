const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Feedback = require("../models/Feedback");

/**
 * POST feedback
 * - Public endpoint
 * - Auth optional
 * - Safe token decode (no middleware call)
 */
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feedback message is required"
      });
    }

    let userId = null;

    // 🔐 Optional token decode (SAFE)
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.user?.id || decoded.id || null;
      } catch {
        userId = null; // invalid token → ignore
      }
    }

    await Feedback.create({
      user: userId,
      message,
      source: "settings"
    });

    res.json({
      success: true,
      message: "Feedback submitted successfully"
    });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback"
    });
  }
});

module.exports = router;
