const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const uploadToS3 = require("../middleware/upload");


/* =====================================
   GET logged-in user info
===================================== */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* =====================================
   UPDATE PROFILE PHOTO (S3)
===================================== */
router.post(
  "/profile-photo",
  auth,
  uploadToS3("profiles").single("profilePhoto"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Profile image is required"
        });
      }

      const imageUrl = req.file.location;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profilePhoto: imageUrl },
        { new: true }
      ).select("name profession profilePhoto");

      res.json({
        success: true,
        user
      });
    } catch (err) {
      console.error("PROFILE PHOTO ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Failed to update profile photo"
      });
    }
  }
);


/* =====================================
   DELETE own account (SETTINGS)
===================================== */
router.delete("/delete", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // delete all posts by user
    await Post.deleteMany({ user: userId });

    // delete user account
    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete account"
    });
  }
});

/* =====================================
   UPDATE user theme
===================================== */
router.put("/theme", auth, async (req, res) => {
  try {
    const { theme } = req.body;

    if (!["light", "dark", "system"].includes(theme)) {
      return res.status(400).json({
        success: false,
        message: "Invalid theme value"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { theme },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      theme: user.theme
    });
  } catch (err) {
    console.error("Theme update error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update theme"
    });
  }
});

/* =====================================
   UPDATE user language
===================================== */
router.put("/language", auth, async (req, res) => {
  try {
    const { language } = req.body;

    if (!["en", "ta", "hi"].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { language },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      language: user.language
    });
  } catch (err) {
    console.error("Language update error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update language"
    });
  }
});
/* =====================================
   SAVED POSTS (STATIC) — MUST BE ABOVE :id
===================================== */
router.get("/saved-posts", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "savedPosts",
        populate: {
          path: "user",
          select: "name profilePhoto profession"
        }
      });

    res.json({
      success: true,
      posts: user.savedPosts || []
    });
  } catch (err) {
    console.error("Saved posts fetch error:", err);
    res.status(500).json({ success: false });
  }
});


/* =====================================
   GET user by ID (PUBLIC PROFILE)
   ⚠️ KEEP THIS AT THE BOTTOM
===================================== */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error("Get user by id error:", err);
    res.json({
      success: false,
      message: "Failed to fetch user"
    });
  }
});




module.exports = router;
