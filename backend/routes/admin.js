const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const Vendor = require("../models/Vendor");
const Product = require("../models/Product");

// ---------------- VENDORS ----------------

// ADD vendor (admin only)
router.post("/vendors", auth, isAdmin, async (req, res) => {
  try {
    const { name, city, address, phone, email } = req.body;
    const vendor = await Vendor.create({ name, city, address, phone, email });
    res.status(201).json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// LIST vendors (admin only)
router.get("/vendors", auth, isAdmin, async (req, res) => {
  try {
    const vendors = await Vendor.find().sort("name");
    res.json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// UPDATE vendor
router.put("/vendors/:id", auth, isAdmin, async (req, res) => {
  try {
    const { name, city, address, phone, email, isActive } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { name, city, address, phone, email, isActive },
      { new: true }
    );
    res.json(vendor);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// DELETE vendor
router.delete("/vendors/:id", auth, isAdmin, async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ msg: "Vendor deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ---------------- PRODUCTS ----------------

// ADD product
router.post("/products", auth, isAdmin, async (req, res) => {
  try {
    const { name, category, price, unit, vendorId, city, imageUrl } = req.body;

    const product = await Product.create({
      name,
      category,
      price,
      unit,
      vendor: vendorId,
      city,
      imageUrl,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// LIST products (admin view)
router.get("/products", auth, isAdmin, async (req, res) => {
  try {
    const products = await Product.find()
      .populate("vendor", "name city")
      .sort("-createdAt");
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// UPDATE product
router.put("/products/:id", auth, isAdmin, async (req, res) => {
  try {
    const { name, category, price, unit, vendorId, city, imageUrl, isActive } =
      req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price,
        unit,
        vendor: vendorId,
        city,
        imageUrl,
        isActive,
      },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// DELETE product
router.delete("/products/:id", auth, isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// PUBLIC products for marketplace
router.get("/products/all", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).populate(
      "vendor",
      "name city"
    );
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
