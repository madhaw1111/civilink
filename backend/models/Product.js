const mongoose = require("mongoose");

/* ===========================
   VARIANT SCHEMA
   (Used for BOTH SALE & RENTAL)
=========================== */
const variantSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true // "20 mm", "40 mm", "5 ft", "50 kg"
    },

    // Used ONLY for SALE (raw materials)
    price: {
      type: Number
    },

    // Used ONLY for RENTAL (equipment)
    dailyPrice: {
      type: Number
    }
  },
  { _id: false }
);

/* ===========================
   PRODUCT SCHEMA
=========================== */
const productSchema = new mongoose.Schema(
  {
    /* BASIC INFO */
    name: {
      type: String,
      required: true,
      trim: true
    },

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

    /* SINGLE PRICE MODE (ONLY IF NO VARIANTS) */
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

    /* RELATIONS */
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

    /* MEDIA */
    imageUrl: {
      type: String,
      default: ""
    },

    /* STATUS */
    isActive: {
      type: Boolean,
      default: true
    },

    /* IDENTIFIERS */
    productCode: {
      type: String,
      required: true
    },

    vendorProductCode: {
      type: String,
      unique: true,
      required: true
    },

    /* VARIANTS (RAW + RENTAL) */
    variants: {
      type: [variantSchema],
      default: []
    }
  },
  { timestamps: true }
);

productSchema.pre("validate", function () {
  // SALE → each variant must have price
  if (this.productType === "SALE" && this.variants.length > 0) {
    for (const v of this.variants) {
      if (v.price == null) {
        throw new Error("Each SALE variant must have a price");
      }
    }
  }

  // RENTAL → each variant must have dailyPrice
  if (this.productType === "RENTAL" && this.variants.length > 0) {
    for (const v of this.variants) {
      if (v.dailyPrice == null) {
        throw new Error("Each RENTAL variant must have a daily price");
      }
    }
  }
});


module.exports = mongoose.model("Product", productSchema);
