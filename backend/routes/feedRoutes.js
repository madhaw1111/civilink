const express = require("express");
const router = express.Router();
const Feed = require("../models/Post");

router.get("/home", async (req, res) => {
  try {
    const feed = await Feed.find()
      .populate("user", "name profession profilePhoto")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      feed
    });

  } catch (error) {
    console.error("HOME FEED ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load home feed"
    });
  }
});

module.exports = router;
