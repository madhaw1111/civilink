const express = require("express");
const router = express.Router();

// 🔒 READ-ONLY ADMIN CONTACT
router.get("/contact", (req, res) => {
  res.json({
    email: process.env.ADMIN_EMAIL || "",
    phone: process.env.ADMIN_PHONE || ""
  });
});

module.exports = router;

// ⚠️ ADMIN CONTACT IS ENV-ONLY
// Do NOT expose admin email via User model or Admin UI
