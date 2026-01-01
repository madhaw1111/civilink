const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: String,

   location: {
  city: {
    type: String,
    required: true
  },
  state: {
    type: String
  }
},


    price: {
      type: Number,
      required: true   // sell price OR monthly rent
    },

    deposit: {
      type: Number     // only for rent
    },

    availableFrom: {
      type: Date       // only for rent
    },

    imageUrl: {
      type: String     // ✅ S3 image URL
    },

    purpose: {
      type: String,
      enum: ["sell", "rent"],
      required: true
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("House", houseSchema);
