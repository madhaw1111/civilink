const mongoose = require("mongoose");

/* =====================
   ORDER ITEM SCHEMA
===================== */
const orderItemSchema = new mongoose.Schema({
  vendorProductCode: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  productType: {
    type: String,
    enum: ["SALE", "RENTAL"],
    required: true
  },

  /* SALE */
  price: {
    type: Number,
    required: function () {
      return this.productType === "SALE";
    }
  },

  /* RENTAL */
  dailyPrice: {
    type: Number,
    required: function () {
      return this.productType === "RENTAL";
    }
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  days: {
    type: Number,
    required: function () {
      return this.productType === "RENTAL";
    },
    min: 1
  },

  unit: String,
  size: String,

  /* CALCULATED */
  itemTotal: {
    type: Number,
    required: true
  }
});

/* =====================
   MAIN ORDER SCHEMA
===================== */
const orderSchema = new mongoose.Schema(
  {
    /* DELIVERY CUSTOMER */
    customer: {
      name: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      email: String,
      address: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      }
    },

    /* VENDOR */
    vendor: {
      name: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      address: {                 // ✅ ADD THIS
    type: String,
    required: true
  },
      email: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      }
    },

    /* ITEMS */
    items: {
      type: [orderItemSchema],
      required: true,
      validate: v => Array.isArray(v) && v.length > 0
    },

    /* GST */
    taxableAmount: {
      type: Number,
      required: true
    },

    cgst: {
      type: Number,
      default: 0
    },

    sgst: {
      type: Number,
      default: 0
    },

    igst: {
      type: Number,
      default: 0
    },

    totalTax: {
      type: Number,
      required: true
    },

    gstRate: {
      type: Number,
      default: 18
    },

    taxType: {
      type: String,
      enum: ["CGST_SGST", "IGST"],
      required: true
    },

    /* TOTAL */
    total: {
      type: Number,
      required: true
    },

    /* INVOICE */
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },

    invoiceUrl: {
      type: String
      // 🔥 NOT required at creation time
    },

    /* STATUS */
    status: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "DELIVERED", "CANCELLED"],
      default: "PLACED"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
