const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: String,
      phone: String,
      email: String,
      address: String
    },

    vendor: {
      vendorId: mongoose.Schema.Types.ObjectId,
      vendorCode: String,
      name: String,
      phone: String,
      email: String
    },

    items: [
      {
        // 🔗 Product identity
        productId: mongoose.Schema.Types.ObjectId,
        productCode: String,          // P-0001
        vendorProductCode: String,    // VND-CHN-0001-P-0001

        name: String,
        productType: {
          type: String,
          enum: ["SALE", "RENTAL"],
          required: true
        },

        // 📦 SALE fields
        price: Number,                // unit price
        quantity: Number,

        // 🏗️ RENTAL fields
        size: String,                 // "5 ft"
        dailyPrice: Number,
        rental: {
          startDate: Date,
          endDate: Date,
          days: Number
        },

        itemTotal: Number             // final calculated total
      }
    ],

    total: {
      type: Number,
      required: true
    },

    invoiceUrl: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "DELIVERED", "RETURNED", "CANCELLED"],
      default: "PLACED"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
