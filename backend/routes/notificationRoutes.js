const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

/* =========================
   GET MY NOTIFICATIONS
========================= */
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("fromUser", "name profilePhoto");

    res.json({
      success: true,
      notifications
    });
  } catch (err) {
    console.error("Fetch notifications error", err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   MARK AS READ
========================= */
router.put("/:id/read", auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      read: true
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});



module.exports = router;
