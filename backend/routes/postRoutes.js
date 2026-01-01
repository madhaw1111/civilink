const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Post = require("../models/Post");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const uploadToS3 = require("../middleware/upload");
const User = require("../models/User");

/* =========================
   OBJECT ID VALIDATOR
========================= */
const validateObjectId = (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID"
    });
  }

  next();
};

/* ================================
   CREATE POST
================================ */
router.post(
  "/create",
  auth,                                  // ✅ FIRST
  uploadToS3("posts").single("image"),   // ✅ SECOND
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("location");

      const { text, type } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({
          success: false,
          message: "Post text required"
        });
      }

      console.log("REQ FILE:", req.file); // 🔍 TEMP DEBUG

      const post = await Post.create({
  user: req.user.id,
  text: text.trim(),
  type: type || "post",
  imageUrl: req.file ? req.file.location : "",
  location: {
    city: user?.location?.city || "",
    state: user?.location?.state || ""
  }
});


      const populatedPost = await post.populate(
        "user",
        "name profession profilePhoto"
      );

      res.status(201).json({
        success: true,
        post: populatedPost
      });
    } catch (err) {
      console.error("CREATE POST ERROR:", err);
      res.status(500).json({ success: false });
    }
  }
);


/* =========================
   EDIT POST (OWNER ONLY)
========================= */
router.put(
  "/:postId",
  auth,
  validateObjectId,
  async (req, res) => {
    try {
      const { text } = req.body;

      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ success: false });
      }

      if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ success: false });
      }

      post.text = text ?? post.text;
    

      await post.save();

      res.json({ success: true, post });
    } catch (err) {
      console.error("EDIT POST ERROR:", err);
      res.status(500).json({ success: false });
    }
  }
);

/**
 * TOGGLE SAVE POST
 * 🔥 MUST BE ABOVE "/:postId"
 */
router.put("/save/:postId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const postId = req.params.postId;

    if (!user) {
      return res.status(404).json({ success: false });
    }

    const alreadySaved = user.savedPosts.includes(postId);

    if (alreadySaved) {
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== postId
      );
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();

    res.json({
      success: true,
      saved: !alreadySaved
    });
  } catch (err) {
    console.error("Save post error:", err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   HIDE / UNHIDE POST
========================= */
router.put("/hide/:postId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const postId = req.params.postId;

    if (!user) {
      return res.status(404).json({ success: false });
    }

    const alreadyHidden = user.hiddenPosts.includes(postId);

    if (alreadyHidden) {
      user.hiddenPosts = user.hiddenPosts.filter(
        id => id.toString() !== postId
      );
    } else {
      user.hiddenPosts.push(postId);
    }

    await user.save();

    res.json({
      success: true,
      hidden: !alreadyHidden
    });
  } catch (err) {
    console.error("Hide post error:", err);
    res.status(500).json({ success: false });
  }
});




/* =========================
   ✅ ADMIN DELETE POST
   (MUST BE ABOVE USER DELETE)
========================= */
router.delete(
  "/admin/:postId",
  auth,
  isAdmin,
  validateObjectId,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found"
        });
      }

      await post.deleteOne();

      res.json({
        success: true,
        message: "Post deleted by admin"
      });
    } catch (err) {
      console.error("ADMIN DELETE POST ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Failed to delete post"
      });
    }
  }
);

// PUT /api/users/location
router.put("/location", auth, async (req, res) => {
  const { city, state, lat, lng } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      location: { city, state, lat, lng }
    },
    { new: true }
  );

  res.json({ success: true, location: user.location });
});

/* =========================
   USER DELETE POST
   (OWNER ONLY)
========================= */
router.delete(
  "/:postId",
  auth,
  validateObjectId,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ success: false });
      }

      if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ success: false });
      }

      await post.deleteOne();

      res.json({ success: true });
    } catch (err) {
      console.error("USER DELETE POST ERROR:", err);
      res.status(500).json({ success: false });
    }
  }
);

/* =========================
   GET ALL POSTS
   (ADMIN / FEED)
========================= */
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email profilePhoto")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    res.status(500).json({ success: false });
  }
});

// REPORT POST
router.post("/:id/report", auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        reported: true,
        reportReason: req.body.reason || "User reported",
        reportedAt: new Date()
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});



module.exports = router;
