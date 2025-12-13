const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],

    contextType: {
      type: String,
      enum: ["house", "profession", "service", "vendor"],
      required: true
    },

    contextId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    lastMessage: {
      type: String,
      default: ""
    },

    lastMessageAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
