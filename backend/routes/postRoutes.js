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

module.exports = router;
