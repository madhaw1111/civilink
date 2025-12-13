const express = require("express");
const router = express.Router();
const House = require("../models/House");
const auth = require("../middleware/auth"); 
/**
 * POST - Sell House
 */
router.post("/sell", async (req, res) => {
  try {
    const { title, location, price, description, image, } = req.body;

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
      image,
      postedBy: req.user.id

    });

    res.json({
      success: true,
      house
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;



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
      image,
      postedBy: req.user.id
    });

    res.json({
      success: true,
      house
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});



/**
 * GET - Buy House (List all houses)
 */
router.get("/buy", async (req, res) => {
  try {
    const houses = await House.find()
      .populate("postedBy", "name profilePhoto profession")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      houses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});



/**
 * GET - Single House
 */
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
