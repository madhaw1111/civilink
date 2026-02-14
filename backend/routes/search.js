const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/professionals", async (req, res) => {
  try {
    const { q, city } = req.query;

    if (!q && !city) {
      return res.json({ success: true, results: [] });
    }

    const query = {
      isProfessional: true,
      "professionalVerification.status": "approved"
    };

    if (city) {
      query["location.city"] = new RegExp(city, "i");
    }

    if (q) {
      query.$or = [
        { name: new RegExp(q, "i") },
        { profession: new RegExp(q, "i") },
        { skills: { $in: [new RegExp(q, "i")] } }
      ];
    }

    const users = await User.find(query)
      .select("name profession skills location profilePhoto")
      .limit(20);

    res.json({ success: true, results: users });
  } catch (err) {
    console.error("SEARCH ERROR", err);
    res.status(500).json({ success: false });
  }
});


module.exports = router;
