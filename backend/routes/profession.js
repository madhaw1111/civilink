const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/update", async (req, res) => {
  try {
    const { userId, profession, skills, experienceYears, profilePhoto } = req.body;

    let updated = await User.findByIdAndUpdate(
      userId,
      {
        profession,
        skills,
        experienceYears,
        profilePhoto,
        isProfessional: profession !== "Member"
      },
      { new: true }
    );

    res.json({ success: true, user: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
