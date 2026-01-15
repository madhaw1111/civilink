const mongoose = require("mongoose");

const landSchema = new mongoose.Schema(
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
      required: true
    },

    // 🔹 LAND-SPECIFIC FIELDS
    approvalType: {
      type: String,    // DTCP / CMDA / Panchayat
    },

    approvalNumber: {
      type: String
    },

    plotArea: {
      type: String     // ex: "1200 sq.ft", "2 cents"
    },

    landmarks: {
      type: String
    },

    loanAvailable: {
      type: Boolean,
      default: false
    },

    layoutImageUrl: {
      type: String     // ✅ S3 layout image
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Land", landSchema);
