const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const AdminLog = require("../models/AdminLog");
const uploadToS3 = require("../middleware/upload");


/* ===========================
   VENDORS
=========================== */
const CITY_CODE = {
  Chennai: "CHN",
  Madurai: "MDU",
  Coimbatore: "CBE",
  Karaikudi: "KKD"
};

// ADD vendor
router.post("/vendors", auth, isAdmin, async (req, res) => {
  try {
    const { name, city, address, phone, email, gstNumber } = req.body;

    // 1️⃣ Duplicate protection (DB level)
    const exists = await Vendor.findOne({
      name: new RegExp(`^${name}$`, "i"),
      city
    });

    if (exists) {
      return res.status(400).json({
        message: "Vendor already exists in this city"
      });
    }

    // 2️⃣ Generate vendor code
    const count = await Vendor.countDocuments();
    const sequence = String(count + 1).padStart(4, "0");
    const cityCode = CITY_CODE[city] || "GEN";

    const vendorCode = `VND-${cityCode}-${sequence}`;

    // 3️⃣ Save vendor WITH vendorCode
    const vendor = await Vendor.create({
      name,
      city,
      address,
      phone,
      email,
      gstNumber,
      vendorCode,
      isActive: true
    });

    // 4️⃣ Admin log
    AdminLog.create({
      adminId: req.user.id,
      action: "CREATE",
      entityType: "Vendor",
      entityId: vendor._id,
      description: `Vendor "${vendor.name}" created (${vendor.vendorCode})`
    }).catch(() => {});

    res.status(201).json(vendor);
  } catch (err) {
    console.error(err);
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
    .populate("vendor", "name city email phone")
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


/* ===========================
   UPLOAD PRODUCT IMAGE (S3)
=========================== */
router.post(
  "/products/:id/image",
  auth,
  isAdmin,
  uploadToS3("products").single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Product image is required"
        });
      }

      const imageUrl = req.file.location;

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { imageUrl },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      AdminLog.create({
        adminId: req.user.id,
        action: "UPDATE",
        entityType: "Product",
        entityId: product._id,
        description: `Product "${product.name}" image updated`
      }).catch(() => {});

      res.json({
        success: true,
        product
      });
    } catch (err) {
      console.error("PRODUCT IMAGE UPLOAD ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Failed to upload product image"
      });
    }
  }
);


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
    "name city email phone"
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
