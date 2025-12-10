const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: {
      type: String,
      enum: ["Chennai", "Madurai", "Coimbatore", "Karaikudi"],
      required: true,
    },
    address: String,
    phone: String,
    email: { type: String, required: true }, // 👈 NEW: vendor Gmail/email
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
