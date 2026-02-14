const express = require("express");
const router = express.Router();
const Feed = require("../models/Post");
const auth = require("../middleware/auth");
const Notification = require("../models/Notification");



router.get("/home", async (req, res) => {
  try {
    const feed = await Feed.find({reported: { $ne: true }})
     .populate({
  path: "user",
  select: "name profession profilePhoto location isProfessional professionalVerification",
  match: {
    $or: [
      { isProfessional: false },
      {
        isProfessional: true,
        "professionalVerification.status": "approved"
      }
    ]
  }
})

      .sort({ createdAt: -1 })
      .lean();

      const normalizedFeed = feed.map(post => ({
  ...post,
  location: post.location || {
    city: post.user?.location?.city || "",
    state: post.user?.location?.state || ""
  }
}));

   res.status(200).json({
  success: true,
  feed: normalizedFeed
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
    // 🔔 CREATE NOTIFICATION (LIKE)
if (post.user.toString() !== userId) {
  await Notification.create({
    user: post.user,              // post owner
    type: "like",
    message: "Someone liked your post",
    post: post._id,
    fromUser: userId
  });
}


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

    // 🔔 CREATE NOTIFICATION (COMMENT)
if (post.user.toString() !== req.user.id) {
  await Notification.create({
    user: post.user,              // post owner
    type: "comment",
    message: "Someone commented on your post",
    post: post._id,
    fromUser: req.user.id
  });
}


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
