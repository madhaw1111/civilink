// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  try {
    // 1️⃣ Get Authorization header
    const authHeader = req.header("Authorization");

    // 2️⃣ Check token existence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied"
      });
    }

    // 3️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * 5️⃣ Normalize user object
     * Supports BOTH JWT styles:
     *  - { user: { id, role } }
     *  - { id, role }
     */
    req.user = {
      id: decoded.user?.id || decoded.id,
      role: decoded.user?.role || decoded.role
    };

    // 6️⃣ Safety check
    if (!req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
    }

    // 7️⃣ Continue
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token is not valid"
    });
  }
};
