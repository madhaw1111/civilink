const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/update", async (req, res) => {
  try {
    const { profession, skills, experienceYears, profilePhoto } = req.body;

    const userId = req.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID missing" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 🔒 LOCK PROFESSION (IMPORTANT)
    if (user.isProfessional && user.profession !== profession) {
      return res.status(400).json({
        success: false,
        message: "Profession already finalized",
      });
    }

    user.profession = profession;
    user.skills = skills || [];
    user.experienceYears = experienceYears || 0;
    user.profilePhoto = profilePhoto || "";
    user.isProfessional = true;

    await user.save();

    res.json({ success: true, user });

  } catch (err) {
    console.error("PROFESSION UPDATE ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// GET professions summary
router.get("/available", async (req, res) => {
  try {
    const result = await User.aggregate([
      { $match: { isProfessional: true } },
      {
        $group: {
          _id: "$profession",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ success: true, professions: result });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


// GET professionals by type
router.get("/:type", async (req, res) => {
  try {
    const type = req.params.type;

    const users = await User.find({
      profession: new RegExp(`^${type}$`, "i"),
      isProfessional: true
    }).select("-password");

    res.json({ success: true, users });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Suggested professionals for home feed
router.get("/suggested/home", async (req, res) => {
  try {
    const users = await User.find({
      isProfessional: true
    })
      .select("name profession profilePhoto skills experienceYears")
      .limit(10);

    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});



module.exports = router;
