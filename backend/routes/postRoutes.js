const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

/* ================================
   CREATE POST
================================ */
router.post("/create", auth, async (req, res) => {
  try {
    const { text, image, type } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Post text required"
      });
    }

    const post = await Post.create({
      user: req.user.id,
      text,
      image,
      type: type || "post"
    });

    const populatedPost = await post.populate(
      "user",
      "name profession profilePhoto"
    );

    res.json({
      success: true,
      post: populatedPost
    });

  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({
      success: false
    });
  }
});

/* =========================
   EDIT POST
========================= */
router.put("/:postId", auth, async (req, res) => {
  try {
    const { text, image } = req.body;

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ success: false });
    }

    // 🔐 only owner can edit
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false });
    }

    post.text = text ?? post.text;
    post.image = image ?? post.image;
    await post.save();

    res.json({ success: true, post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   DELETE POST
========================= */
router.delete("/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ success: false });
    }

    // 🔐 only owner can delete
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false });
    }

    await post.deleteOne();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
