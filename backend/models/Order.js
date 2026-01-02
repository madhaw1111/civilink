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
      name: String,
      email: String,
      phone: String
    },

    items: [
      {
        name: String,
        price: Number,
        quantity: Number
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

   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
