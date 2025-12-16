const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["post", "sell", "rent"],
      default: "post"
    },
    text: {
      type: String,
      required: true
    },
    image: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
