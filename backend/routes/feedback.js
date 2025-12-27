const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Feedback = require("../models/Feedback");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

/**
 * POST feedback (public, auth optional)
 */
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feedback message is required",
      });
    }

    let userId = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id || null;
      } catch {
        userId = null;
      }
    }

    await Feedback.create({
      user: userId,
      message,
      source: "settings",
    });

    res.json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (err) {
    console.error("Feedback POST error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
});

/**
 * GET feedback (ADMIN ONLY)
 */
router.get("/admin", auth, isAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    console.error("Feedback GET error:", err);
    res.status(500).json({
      message: "Failed to load feedback",
    });
  }
});


/**
 * DELETE feedback (ADMIN ONLY)
 */
router.delete("/admin/:id", auth, isAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    await feedback.deleteOne();

    res.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (err) {
    console.error("Delete feedback error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
    });
  }
});


module.exports = router;
