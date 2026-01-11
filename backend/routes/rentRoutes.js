const express = require("express");
const router = express.Router();
const RentHouse = require("../models/RentHouse");
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const uploadToS3 = require("../middleware/upload");

/**
 * POST — Rent / To-Let (Owner posts)
 * ALSO adds entry to Home Feed + Portfolio
 */
router.post(
  "/post",
  auth,
  uploadToS3("houses/rent").single("image"),   // 🔑 S3 upload
  async (req, res) => {
    try {
      const {
        title,
        location,
        rent,
        deposit,
        description,
        availableFrom
      } = req.body;

      if (!title || !location || !rent) {
        return res.status(400).json({
          success: false,
          message: "Title, location and rent are required"
        });
      }

      const imageUrl = req.file ? req.file.location : "";

      // 1️⃣ Create RentHouse (detail storage)
      const rentHouse = await RentHouse.create({
        title,
        location,
        rent: Number(rent),
        deposit: deposit ? Number(deposit) : 0,
        description,
        availableFrom,
        imageUrl,                 // ✅ FIXED
        postedBy: req.user.id
      });

      // 2️⃣ Create Home Feed Post (same imageUrl)
      const feedPost = await Post.create({
        user: req.user.id,
        type: "rent",
        text: `🔑 House for Rent / To-Let
${title}
₹${rent}
${location.city}${location.state ? ", " + location.state : ""}

${description || ""}`,
        imageUrl,
        location : rentHouse.location               // ✅ FIXED
      });

      res.status(201).json({
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
  }
);

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
    res.status(500).json({ success: false });
  }
});

module.exports = router;
