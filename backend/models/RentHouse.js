const mongoose = require("mongoose");

const rentHouseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    rent: {
      type: Number,
      required: true
    },
    deposit: {
      type: Number
    },
    description: {
      type: String
    },
    image: {
      type: String // image URL
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
