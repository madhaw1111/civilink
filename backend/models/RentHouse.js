const mongoose = require("mongoose");

const rentHouseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    location: {
  city: {
    type: String,
    required: true
  },
  state: {
    type: String
  }
},

    rent: {
      type: Number,
      required: true
    },

    deposit: {
      type: Number,
      default: 0
    },

    description: {
      type: String,
      default: ""
    },

    // 🔑 SINGLE SOURCE OF TRUTH FOR IMAGE
    imageUrl: {
      type: String,
      default: ""
    },

    availableFrom: {
      type: Date
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RentHouse", rentHouseSchema);
