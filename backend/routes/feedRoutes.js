const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const House = require("../models/House");
// const Rent = require("../models/Rent"); // future

router.get("/home", async (req, res) => {
  try {
    /* ================= NORMAL POSTS ================= */
    const posts = await Post.find()
      .populate("user", "name profession profilePhoto")
      .sort({ createdAt: -1 })
      .lean();

    /* ================= SELL HOUSE POSTS ================= */
    const sellHouses = await House.find({ purpose: "sell" })
      .populate("postedBy", "name profession profilePhoto")
      .sort({ createdAt: -1 })
      .lean();

    /* ================= NORMALIZE POSTS ================= */
    const normalizedPosts = posts.map(p => ({
      id: p._id.toString(),
      type: "post",
      user: p.user,
      text: p.text,
      image: p.image,
      location: p.location || null,
      price: null,
      createdAt: p.createdAt
    }));

    /* ================= NORMALIZE SELL HOUSES ================= */
    const normalizedSell = sellHouses.map(h => ({
      id: h._id.toString(),
      type: "sell",
      user: h.postedBy,
      title: h.title,
      image: h.image,
      price: h.price,
      location: h.location,
      text: h.description || null,
      createdAt: h.createdAt
    }));

    /* ================= MERGE & SORT ================= */
    const feed = [...normalizedPosts, ...normalizedSell].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

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
