const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, "CIVILINK_SECRET_KEY", { expiresIn: "30d" });
};

// ----------------------
// REGISTER
// ----------------------
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // check existing user
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    // Create new user (password hashes automatically)
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    res.json({
      success: true,
      message: "Registered successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------
// LOGIN
// ----------------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // success login
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
