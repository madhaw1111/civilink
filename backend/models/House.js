const express = require("express");
const router = express.Router();
const House = require("../models/House");
const auth = require("../middleware/auth");

/* ================================
   SELL HOUSE
================================ */
router.post("/sell", auth, async (req, res) => {
  try {
    const { title, location, price, description, image } = req.body;

    if (!title || !location || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const house = await House.create({
      title,
      location,
      price,
      description,
      image: image || "",
      postedBy: req.user.id
    });

    res.json({
      success: true,
      house
    });
  } catch (err) {
    console.error("SELL HOUSE ERROR:", err);
    res.status(500).json({
      success: false
    });
  }
});



/* ================================
   BUY HOUSE
================================ */
router.get("/buy", async (req, res) => {
  try {
    const houses = await House.find()
      .populate("postedBy", "name profilePhoto profession")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      houses
    });
  } catch (err) {
    console.error("BUY HOUSE ERROR:", err);
    res.status(500).json({
      success: false
    });
  }
});


/* ================================
   HOUSE DETAILS
================================ */
router.get("/:id", async (req, res) => {
  try {
    const house = await House.findById(req.params.id)
      .populate("postedBy", "name profilePhoto profession");

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found"
      });
    }

    res.json({
      success: true,
      house
    });
  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
});
