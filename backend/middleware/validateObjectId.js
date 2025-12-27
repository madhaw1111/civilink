const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID"
    });
  }

  next();
};
