const express = require("express");
const router = express.Router();

const House = require("../models/House");
const Post = require("../models/Post");

const auth = require("../middleware/auth");
const uploadToS3 = require("../middleware/upload");

/* ======================================================
   POST — SELL HOUSE
   → Creates House
   → Creates Home Feed Post
   → Image stored in S3: houses/sell/
====================================================== */
router.post(
  "/sell",
  auth,
  uploadToS3("houses/sell").single("image"),
  async (req, res) => {
    try {
      const { title, city,state, price, description } = req.body;
       const location = { city, state };

      if (!title || !city || !price) {
        return res.status(400).json({
          success: false,
          message: "Title, location and price are required"
        });
      }

      const imageUrl = req.file ? req.file.location : "";

      // 1️⃣ Create House document
      const house = await House.create({
        title,
        location,
        price: Number(price),
        description,
        imageUrl,
        purpose: "sell",
        postedBy: req.user.id
      });

      // 2️⃣ Create Home Feed Post
      const feedPost = await Post.create({
        user: req.user.id,
        type: "sell",
        text: `🏠 House for Sale
${house.title}
₹${house.price}
${house.location.city}${house.location.state ? ", " + house.location.state : ""}


${house.description || ""}`,
        imageUrl,
        location: {
    city: house.location.city,
    state: house.location.state
  }
      });

      res.status(201).json({
        success: true,
        house,
        feedPost
      });

    } catch (error) {
      console.error("SELL HOUSE ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }
);

/* ======================================================
   POST — RENT / TO-LET HOUSE
   → Creates House
   → Creates Home Feed Post
   → Image stored in S3: houses/rent/
====================================================== */
router.post(
  "/rent",
  auth,
  uploadToS3("houses/rent").single("image"),
  async (req, res) => {
    try {
      const {
        title,
        location,
        price,
        description,
        rentType,
        availableFrom
      } = req.body;

      if (!title || !location || !price) {
        return res.status(400).json({
          success: false,
          message: "Title, location and rent amount are required"
        });
      }

      const imageUrl = req.file ? req.file.location : "";

      // 1️⃣ Create House document
      const house = await House.create({
        title,
        location,
        price: Number(price),
        description,
        imageUrl,
        purpose: "rent",
        rentType,
        availableFrom,
        postedBy: req.user.id
      });

      // 2️⃣ Create Home Feed Post
      const feedPost = await Post.create({
        user: req.user.id,
        type: "rent",
        text: `🔑 House for Rent / To-Let
${house.title}
₹${house.price}
${house.location}
${house.description || ""}`,
        imageUrl
      });

      res.status(201).json({
        success: true,
        house,
        feedPost
      });

    } catch (error) {
      console.error("RENT HOUSE ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }
);

/* ======================================================
   GET — BUY HOUSE (SELL LISTINGS)
====================================================== */
router.get("/buy", async (req, res) => {
  try {
    const houses = await House.find({ purpose: "sell" })
      .populate("postedBy", "name profession profilePhoto")
      .sort({ createdAt: -1 });

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

/* ======================================================
   GET — RENT / TO-LET LISTINGS
====================================================== */
router.get("/rent-list", async (req, res) => {
  try {
    const houses = await House.find({ purpose: "rent" })
      .populate("postedBy", "name profession profilePhoto")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      houses
    });
  } catch (error) {
    console.error("RENT LIST ERROR:", error);
    res.status(500).json({
      success: false
    });
  }
});

/* ======================================================
   GET — SINGLE HOUSE DETAILS
====================================================== */
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
      message: "Server error"
    });
  }
});

module.exports = router;
