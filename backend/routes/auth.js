const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const User = require("../models/User");

router.post("/register", register);
router.post("/login", login);

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.otp)
    return res.status(400).json({ message: "OTP not found" });

  if (user.otpAttempts >= 5)
    return res.status(403).json({ message: "Too many attempts" });

  if (new Date() > user.otpExpiresAt)
    return res.status(410).json({ message: "OTP expired" });

  if (user.otp !== otp) {
    user.otpAttempts += 1;
    await user.save();
    return res.status(401).json({ message: "Invalid OTP" });
  }

  // ✅ OTP VERIFIED
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  user.otpAttempts = 0;
  await user.save();

  res.json({ success: true });
});

module.exports = router;
