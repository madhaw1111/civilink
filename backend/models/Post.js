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

    imageUrl: {
      type: String,
      default: ""   // ✅ NEW FIELD
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        text: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
   /* =========================
       REPORT / MODERATION
    ========================= */
    reported: {
      type: Boolean,
      default: false
    },

    reportReason: {
      type: String,
      default: ""
    },

    reportedAt: {
      type: Date
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
