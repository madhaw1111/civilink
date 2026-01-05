const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { generateOTP } = require("../utils/otp");
const { sendOTP } = require("../utils/mailer");

/* SEND OTP */
router.post("/send", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOTP();

  user.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  };

  await user.save();
  await sendOTP(email, otp);

  res.json({ success: true });
});

/* VERIFY OTP */
router.post("/verify", async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.otp)
    return res.status(400).json({ message: "OTP not found" });

  if (
    user.otp.code !== otp ||
    user.otp.expiresAt < new Date()
  ) {
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }

  user.otp = undefined;
  await user.save();

  res.json({ success: true });
});

module.exports = router;
