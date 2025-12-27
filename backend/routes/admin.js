const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const AdminLog = require("../models/AdminLog");

/* ===========================
   VENDORS
=========================== */

// ADD vendor
router.post("/vendors", auth, isAdmin, async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);

    AdminLog.create({
      adminId: req.user.id,
      action: "CREATE",
      entityType: "Vendor",
      entityId: vendor._id,
      description: `Vendor "${vendor.name}" created`,
    }).catch(() => {});

    res.status(201).json(vendor);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LIST vendors
router.get("/vendors", auth, isAdmin, async (req, res) => {
  const vendors = await Vendor.find().sort("name");
  res.json(vendors);
});

// UPDATE vendor
router.put("/vendors/:id", auth, isAdmin, async (req, res) => {
   console.log("ADMIN USER ID:", req.user.id);
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (vendor) {
      AdminLog.create({
        adminId: req.user.id,
        action: "UPDATE",
        entityType: "Vendor",
        entityId: vendor._id,
        description: `Vendor "${vendor.name}" updated`,
      }).catch(() => {});
    }

    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE vendor
router.delete("/vendors/:id", auth, isAdmin, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    await vendor.deleteOne();

    AdminLog.create({
      adminId: req.user.id,
      action: "DELETE",
      entityType: "Vendor",
      entityId: vendor._id,
      description: `Vendor "${vendor.name}" deleted`,
    }).catch(() => {});

    res.json({ message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================
   PRODUCTS
=========================== */

// ADD product
router.post("/products", auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      vendor: req.body.vendorId,
    });

    AdminLog.create({
      adminId: req.user.id,
      action: "CREATE",
      entityType: "Product",
      entityId: product._id,
      description: `Product "${product.name}" created`,
    }).catch(() => {});

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LIST products
router.get("/products", auth, isAdmin, async (req, res) => {
  const products = await Product.find()
    .populate("vendor", "name city")
    .sort("-createdAt");

  res.json(products);
});

// UPDATE product
router.put("/products/:id", auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        vendor: req.body.vendorId,
      },
      { new: true }
    );

    if (product) {
      AdminLog.create({
        adminId: req.user.id,
        action: "UPDATE",
        entityType: "Product",
        entityId: product._id,
        description: `Product "${product.name}" updated`,
      }).catch(() => {});
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE product
router.delete("/products/:id", auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();

    AdminLog.create({
      adminId: req.user.id,
      action: "DELETE",
      entityType: "Product",
      entityId: product._id,
      description: `Product "${product.name}" deleted`,
    }).catch(() => {});

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================
   PUBLIC PRODUCTS
=========================== */

router.get("/products/all", async (req, res) => {
  const products = await Product.find({ isActive: true }).populate(
    "vendor",
    "name city"
  );
  res.json(products);
});

/* ===========================
   ADMIN ACTIVITY LOGS
=========================== */

router.get("/logs", auth, isAdmin, async (req, res) => {
  const logs = await AdminLog.find()
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(logs);
});

module.exports = router;
