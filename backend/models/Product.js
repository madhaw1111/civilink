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

    // ✅ Used ONLY when SALE has NO variants
    price: {
      type: Number,
      required: function () {
        return (
          this.productType === "SALE" &&
          (!this.variants || this.variants.length === 0)
        );
      }
    },

    unit: {
      type: String,
      required: function () {
        return (
          this.productType === "SALE" &&
          (!this.variants || this.variants.length === 0)
        );
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

    // ✅ UNIVERSAL VARIANTS (SALE + RENTAL)
    variants: [
      {
        size: {
          type: String,
          required: true // "20 mm", "40 mm", "5 ft"
        },

        price: {
          type: Number,
          required: function () {
            return this.parent().productType === "SALE";
          }
        },

        dailyPrice: {
          type: Number,
          required: function () {
            return this.parent().productType === "RENTAL";
          }
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
