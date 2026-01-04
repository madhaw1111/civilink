const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const generateInvoice = require("../utils/generateInvoice");
const uploadInvoiceToS3 = require("../utils/uploadInvoiceToS3");
const Order = require("../models/Order");
const calculateGST = require("../utils/calculateGST");
const generateInvoiceNumber = require("../utils/generateInvoiceNumber");
const Vendor = require("../models/Vendor");

// POST /api/order
router.post("/", async (req, res) => {
  try {
   const { customer = {}, cart = [], vendorId } = req.body;

const vendorDoc = await Vendor.findById(vendorId);
if (!vendorDoc) {
  return res.status(400).json({
    success: false,
    message: "Vendor not found"
  });
}


    if (!cart.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    if (!vendorDoc.email || !vendorDoc.phone || !vendorDoc.address) {
  return res.status(400).json({
    success: false,
    message: "Vendor contact details incomplete"
  });
}

    /* ======================
       1️⃣ NORMALIZE ITEMS (SAFE)
    ====================== */
    const items = cart.map(item => {
      if (!item.vendorProductCode) {
        throw new Error("vendorProductCode missing in cart item");
      }

      const quantity = Number(item.quantity) || 1;

      // SALE
      if (item.productType === "SALE") {
        const price = Number(item.price);
        if (isNaN(price)) throw new Error("Invalid SALE price");

        return {
          name: item.name,
          vendorProductCode: item.vendorProductCode,
          productType: "SALE",
          quantity,
          price,
          unit: item.unit,
          size: item.size,
          itemTotal: price * quantity
        };
      }

      // RENTAL
      const dailyPrice = Number(item.dailyPrice);
      const days = Number(item.days) || 1;
      if (isNaN(dailyPrice)) throw new Error("Invalid RENTAL dailyPrice");

      return {
        name: item.name,
        vendorProductCode: item.vendorProductCode,
        productType: "RENTAL",
        quantity,
        dailyPrice,
        days,
        unit: item.unit,
        size: item.size,
        itemTotal: dailyPrice * quantity * days
      };
    });

    /* ======================
       2️⃣ STATE NORMALIZATION (CRITICAL)
    ====================== */
    const vendorState = vendorDoc.state || "Tamil Nadu";
    const customerState = customer.state || "Tamil Nadu";

    /* ======================
       3️⃣ GST CALCULATION (FIXED)
    ====================== */
    const gst = calculateGST(
      items.map(i => ({
        productType: i.productType,
        price: i.productType === "SALE" ? i.price : i.dailyPrice,
        quantity: i.quantity,
        days: i.days
      })),
      vendorState,
      customerState
    );

    const invoiceNumber = await generateInvoiceNumber();

    /* ======================
       4️⃣ SAVE ORDER
    ====================== */
    const order = await Order.create({
      customer: {
        ...customer,
        state: customerState
      },

     vendor: {
  name: vendorDoc.name,
  email: vendorDoc.email,
  phone: vendorDoc.phone,
  address: vendorDoc.address,
  state: "Tamil Nadu"
},


      items,
      invoiceNumber,

      taxableAmount: gst.taxableAmount,
      cgst: gst.cgst,
      sgst: gst.sgst,
      igst: gst.igst,
      totalTax: gst.totalTax,
      total: gst.grandTotal,

      gstRate: gst.gstRate,
      taxType: gst.taxType,

      status: "PLACED"
    });

    /* ======================
       5️⃣ GENERATE INVOICE
    ====================== */
    const invoiceBuffer = await generateInvoice({
      order,
       vendor: order.vendor,
      customer,
      items,
      gst
    });

    /* ======================
       6️⃣ UPLOAD TO S3
    ====================== */
    const invoiceUrl = await uploadInvoiceToS3(invoiceBuffer);
    order.invoiceUrl = invoiceUrl;
    await order.save();

    /* ======================
       7️⃣ EMAIL VENDOR
    ====================== */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS
      }
    });

    await transporter.verify();

    const itemsText = items
      .map(i =>
        i.productType === "SALE"
          ? `${i.name} | ₹${i.price} × ${i.quantity}`
          : `${i.name} | ₹${i.dailyPrice} × ${i.quantity} × ${i.days} days`
      )
      .join("\n");

    const message = `
NEW ORDER RECEIVED – CIVILINK

Customer Name: ${customer.name}
Phone: ${customer.phone}
Address:
${customer.address}

-------------------------
ORDER ITEMS:
${itemsText}

-------------------------
TAXABLE: ₹${gst.taxableAmount}
TAX: ₹${gst.totalTax}
TOTAL: ₹${gst.grandTotal}

Invoice:
${invoiceUrl}
`;

    await transporter.sendMail({
      from: `"Civilink Orders" <${process.env.ADMIN_EMAIL}>`,
      to: vendorDoc.email,
      cc: process.env.ADMIN_EMAIL,
      subject: "New Order from Civilink",
      text: message,
      attachments: [
        {
          filename: "invoice.pdf",
          content: invoiceBuffer
        }
      ]
    });

    /* ======================
       8️⃣ WHATSAPP LINK
    ====================== */
    const whatsappLink = `https://wa.me/${vendorDoc.phone}?text=${encodeURIComponent(
      message
    )}`;

    res.json({
      success: true,
      orderId: order._id,
      invoiceUrl,
      whatsappLink
    });

  } catch (err) {
    console.error("ORDER ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: err.message || "Order processing failed"
    });
  }
});

module.exports = router;
