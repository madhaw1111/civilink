const express = require("express");
const router = express.Router();
const House = require("../models/House");
const auth = require("../middleware/auth");

/**
 * POST - Sell House (SECURED)
 * This automatically appears in Home Feed via feedRoutes.js
 */
router.post("/sell", auth, async (req, res) => {
  try {
    const { title, location, price, description, image } = req.body;

    if (!title || !location || !price) {
      return res.status(400).json({
        success: false,
        message: "Title, location and price are required"
      });
    }

    const house = await House.create({
      title,
      location,
      price: Number(price),
      description,
      image,
      postedBy: req.user.id // ✅ authenticated user
    });

    res.status(201).json({
      success: true,
      message: "House posted successfully",
      house
    });

  } catch (error) {
    console.error("SELL HOUSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET - Buy House (List & Filter)
 */
router.get("/buy", async (req, res) => {
  try {
    const { location, minPrice, maxPrice, sort, q } = req.query;

    const filter = {};

    // 🔍 Search
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } }
      ];
    }

    // 📍 Location filter
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // 💰 Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // 🔃 Sorting
    let sortOption = { createdAt: -1 };
    if (sort === "priceLow") sortOption = { price: 1 };
    if (sort === "priceHigh") sortOption = { price: -1 };

    const houses = await House.find(filter)
      .populate("postedBy", "name profession profilePhoto")
      .sort(sortOption);

    res.json({
      success: true,
      houses
    });

  } catch (error) {
    console.error("BUY HOUSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/**
 * GET - Single House
 */
router.get("/:id", async (req, res) => {
  try {
    const house = await House.findById(req.params.id)
      .populate("postedBy", "name profession profilePhoto");

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

  } catch (error) {
    console.error("HOUSE DETAILS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
