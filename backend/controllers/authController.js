const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP, otpExpiry } = require("../utils/otp");
const { sendOTP } = require("../utils/mailer");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* =================================================
   REGISTER (EMAIL + PASSWORD → OTP)
================================================= */
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      profession: "Member",
      isProfessional: false,
      role: "user"
    });

    // 🔐 OTP SETUP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = otpExpiry();
    user.otpAttempts = 0;
    await user.save();

    await sendOTP(user.email, otp);

    return res.status(201).json({
      success: true,
      message: "OTP sent for verification"
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =================================================
   LOGIN (PASSWORD → OTP)
================================================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 🔐 OTP SETUP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = otpExpiry();
    user.otpAttempts = 0;
    await user.save();

    await sendOTP(user.email, otp);

    return res.json({
      success: true,
      message: "OTP sent for verification"
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =================================================
   VERIFY OTP (FINAL AUTH STEP)
================================================= */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.otp) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (user.otpAttempts >= 5) {
      return res.status(403).json({
        message: "Too many OTP attempts. Try again later."
      });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(410).json({ message: "OTP expired" });
    }

    if (user.otp !== otp) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // ✅ OTP VERIFIED → CLEANUP
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    await user.save();

    // 🔑 FINAL JWT (THIS ENABLES HOME PAGE ACCESS)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      user,
      token,
      role: user.role
    });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =================================================
   GOOGLE LOGIN
================================================= */
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        profilePhoto: picture,
        password: await bcrypt.hash("GOOGLE_AUTH", 10),
        role: "user"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      user,
      token,
      role: user.role
    });

  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

/* =================================================
   FORGOT PASSWORD (SEND OTP)
================================================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = otpExpiry();
    user.otpAttempts = 0;
    await user.save();

    await sendOTP(email, otp);

    res.json({ success: true, message: "OTP sent for password reset" });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =================================================
   RESET PASSWORD (OTP + NEW PASSWORD)
================================================= */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(410).json({ message: "OTP expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
