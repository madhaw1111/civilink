const express = require("express");
const router = express.Router();

const Land = require("../models/Land");
const Post = require("../models/Post");

const auth = require("../middleware/auth");
const uploadToS3 = require("../middleware/upload");

/* ======================================================
   POST — SELL LAND
   → Creates Land
   → Creates Home Feed Post
   → Image stored in S3: lands/sell/
====================================================== */
router.post(
  "/sell",
  auth,
  uploadToS3("lands/sell").single("layoutImage"),
  async (req, res) => {
    try {
      const {
        title,
        city,
        state,
        price,
        description,
        approvalType,
        approvalNumber,
        plotArea,
        landmarks,
        loanAvailable
      } = req.body;

      if (!title || !city || !price) {
        return res.status(400).json({
          success: false,
          message: "Title, location and price are required"
        });
      }

      const layoutImageUrl = req.file ? req.file.location : "";

      // 1️⃣ Create Land document
      const land = await Land.create({
        title,
        location: { city, state },
        price: Number(price),
        description,
        approvalType,
        approvalNumber,
        plotArea,
        landmarks,
        loanAvailable: loanAvailable === "true" || loanAvailable === true,
        layoutImageUrl,
        postedBy: req.user.id
      });

      // 2️⃣ Create Home Feed Post (SAME FEED SYSTEM)
      const feedPost = await Post.create({
        user: req.user.id,
        type: "sell",   // 👈 keep SAME feed type
        text: `🌍 Land for Sale
${land.title}
₹${land.price}
${land.location.city}${land.location.state ? ", " + land.location.state : ""}

${land.approvalType ? land.approvalType + " Approved" : ""}
${land.plotArea ? "Area: " + land.plotArea : ""}
${land.description || ""}`,
        imageUrl: land.layoutImageUrl,
        location: {
          city: land.location.city,
          state: land.location.state
        }
      });

      res.status(201).json({
        success: true,
        land,
        feedPost
      });

    } catch (error) {
      console.error("SELL LAND ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }
);

/* ======================================================
   GET — BUY LAND
====================================================== */
router.get("/buy", async (req, res) => {
  try {
    const lands = await Land.find()
      .populate("postedBy", "name profession profilePhoto")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      lands
    });
  } catch (error) {
    console.error("BUY LAND ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
