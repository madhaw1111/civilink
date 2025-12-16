const express = require("express");
const router = express.Router();
const RentHouse = require("../models/RentHouse");
const auth = require("../middleware/auth");

/**
 * POST — Rent / To-Let (Owner posts)
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

    const rentHouse = await RentHouse.create({
      title,
      location,
      rent: Number(rent),
      deposit: deposit ? Number(deposit) : 0,
      description,
      image,
      availableFrom,
      postedBy: req.user.id   // 🔑 from auth.js
    });

    res.json({
      success: true,
      rentHouse
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
