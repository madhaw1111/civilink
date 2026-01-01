const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth"); 

/**
 * GET user profile posts (portfolio)
 */
router.get("/:userId/posts", async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.params.userId
    })
      .sort({ createdAt: -1 })
      .populate("user", "name profession profession");

    res.json({
      success: true,
      posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load posts"
    });
  }
});




module.exports = router;
