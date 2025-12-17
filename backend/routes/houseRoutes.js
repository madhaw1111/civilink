const express = require("express");
const router = express.Router();
const House = require("../models/House");
const Feed = require("../models/Post");   // ✅ ADD THIS
const auth = require("../middleware/auth");

/**
 * POST - Sell House (SECURED)
 * This WILL appear in Home Feed
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

    // 1️⃣ Create House
    const house = await House.create({
      title,
      location,
      price: Number(price),
      description,
      image,
      purpose: "sell", 
      postedBy: req.user.id
    });

   // 2️⃣ CREATE HOME FEED POST (USING Post MODEL CORRECTLY)
const feedPost = await Feed.create({
  user: req.user.id,
  type: "sell",                        // ✅ matches Post.js enum
  text: `🏠 House for Sale\n${house.title}\n₹${house.price}\n${house.location}\n${house.description || ""}`,
  image: house.image
});

    console.log("FEED CREATED 👉", feedPost); // 🔥 ADD THIS
    
    res.status(201).json({
      success: true,
      message: "House posted successfully",
      house,
      feedPost          // ✅ send feed post to frontend
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

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } }
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

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


/**
 * POST - To-Let House
 */
router.post("/rent", auth, async (req, res) => {
  try {
    const {
      title,
      location,
      price,
      description,
      image,
      rentType // monthly / yearly (optional)
    } = req.body;

    if (!title || !location || !price) {
      return res.status(400).json({
        success: false,
        message: "Title, location and rent amount are required"
      });
    }

    // 1️⃣ Create House (rent)
    const house = await House.create({
      title,
      location,
      price: Number(price),
      description,
      image,
      purpose: "rent",          // 🔥 KEY DIFFERENCE
      rentType,
      postedBy: req.user.id
    });

    // 2️⃣ Create Feed Post
   const feedPost = await Feed.create({
  user: req.user.id,
  type: "rent",                        // ✅ matches Post.js enum
  text: `🔑 House for Rent\n${house.title}\n₹${house.price}\n${house.location}\n${house.description || ""}`,
  image: house.image
});

    res.status(201).json({
      success: true,
      message: "House listed for rent",
      house,
      feedPost
    });

  } catch (error) {
    console.error("RENT HOUSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});