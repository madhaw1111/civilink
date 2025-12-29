const express = require("express");
const router = express.Router();
const Feed = require("../models/Post");
const auth = require("../middleware/auth");


router.get("/home", async (req, res) => {
  try {
    const feed = await Feed.find({reported: { $ne: true }})
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

// routes/feedRoutes.js
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Feed.findById(req.params.id);
    const userId = req.user.id;

    if (!post) {
      return res.status(404).json({ success: false });
    }

    const index = post.likes.findIndex(
      id => id.toString() === userId
    );

    if (index > -1) {
      post.likes.splice(index, 1); // unlike
    } else {
      post.likes.push(userId); // like
    }

    await post.save();

    res.json({
      success: true,
      postId: post._id,
      likes: post.likes
    });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ success: false });
  }
});


router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false });
    }

    const post = await Feed.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false });
    }

    const comment = {
      user: req.user.id,
      text
    };

    post.comments.push(comment);
    await post.save();

    await post.populate("comments.user", "name");

    res.json({
      success: true,
      comments: post.comments
    });
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ success: false });
  }
});


router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Feed.findById(req.params.id)
      .populate("comments.user", "name");

    if (!post) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      comments: post.comments
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});







module.exports = router;
