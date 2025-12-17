const express = require("express");
const router = express.Router();
const RentHouse = require("../models/RentHouse");
const Post = require("../models/Post");          // ✅ ADD THIS
const auth = require("../middleware/auth");

/**
 * POST — Rent / To-Let (Owner posts)
 * ALSO adds entry to Home Feed (Post)
 */
router.post("/post", auth, async (req, res) => {
  try {
    const {
      title,
      location,
      rent,
      deposit,
      description,
      image,
      availableFrom
    } = req.body;

    if (!title || !location || !rent) {
      return res.status(400).json({
        success: false,
        message: "Title, location and rent are required"
      });
    }

    // 1️⃣ Create RentHouse (detail storage)
    const rentHouse = await RentHouse.create({
      title,
      location,
      rent: Number(rent),
      deposit: deposit ? Number(deposit) : 0,
      description,
      image,
      availableFrom,
      postedBy: req.user.id
    });

    // 2️⃣ CREATE HOME FEED POST (🔥 THIS WAS MISSING)
    const feedPost = await Post.create({
      user: req.user.id,
      type: "rent",   // ✅ matches Post.js enum
      text: `🔑 House for Rent / To-Let
${title}
₹${rent}
${location}
${description || ""}`,
      image
    });

    res.json({
      success: true,
      rentHouse,
      feedPost
    });

  } catch (err) {
    console.error("RENT POST ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/**
 * GET — Rent / To-Let listings (Tenants browse)
 */
router.get("/list", async (req, res) => {
  try {
    const rentHouses = await RentHouse.find()
      .populate("postedBy", "name profilePhoto")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      rentHouses
    });
  } catch (err) {
    console.error("RENT LIST ERROR:", err);
    res.status(500).json({
      success: false
    });
  }
});

module.exports = router;
