const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

/* ================= CONNECT ================= */
router.post("/:id/connect", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const targetId = req.params.id;

    if (userId === targetId) {
      return res.status(400).json({
        success: false,
        message: "Cannot connect with yourself"
      });
    }

    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!user || !target) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.connections.includes(targetId)) {
      return res.status(400).json({
        success: false,
        message: "Already connected"
      });
    }

    user.connections.push(targetId);
    target.connections.push(userId);

    await user.save();
    await target.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ================= DISCONNECT ================= */
router.post("/:id/disconnect", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const targetId = req.params.id;

    await User.findByIdAndUpdate(userId, {
      $pull: { connections: targetId }
    });

    await User.findByIdAndUpdate(targetId, {
      $pull: { connections: userId }
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* ================= GET CONNECTIONS ================= */
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("connections", "name profession profilePhoto");

    res.json({
      success: true,
      connections: user.connections
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
