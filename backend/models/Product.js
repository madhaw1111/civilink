const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["raw", "furniture", "electrical", "plumbing", "concrete", "rental"],
      required: true,
    },
    price: { type: Number, required: true },
    unit: { type: String, required: true }, // "per bag", "per ton" etc.
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    city: {
      type: String,
      enum: ["Chennai", "Madurai", "Coimbatore", "Karaikudi"],
      required: true,
    },
    imageUrl: { type: String, default: "" }, // 👈 picture url
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
