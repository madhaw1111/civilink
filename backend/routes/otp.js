const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { generateOTP } = require("../utils/otp");
const { sendOTP } = require("../utils/mailer");

/* ================= SEND OTP ================= */
router.post("/send", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    user.otpAttempts = 0;

    await user.save();
    await sendOTP(email, otp);

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.otp) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(401).json({ message: "OTP expired" });
    }

    if (user.otp !== otp) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;

    await user.save();

    res.json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

module.exports = router;