const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    category: {
      type: String,
      enum: ["raw", "furniture", "electrical", "plumbing", "concrete", "rental"],
      required: true
    },

    productType: {
      type: String,
      enum: ["SALE", "RENTAL"],
      required: true
    },

    price: {
      type: Number,
      required: function () {
        return this.productType === "SALE";
      }
    },

    unit: {
      type: String,
      required: function () {
        return this.productType === "SALE";
      }
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true
    },

    city: {
      type: String,
      enum: ["Chennai", "Madurai", "Coimbatore", "Karaikudi"],
      required: true
    },

    imageUrl: { type: String, default: "" },

    isActive: { type: Boolean, default: true },

    productCode: {
      type: String,
      required: true
    },

    vendorProductCode: {
      type: String,
      unique: true,
      required: true
    },

    // ✅ RENTAL VARIANTS
    variants: [
      {
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        dailyPrice: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
