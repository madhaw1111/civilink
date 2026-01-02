const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const generateInvoice = require("../utils/generateInvoice");
const uploadInvoiceToS3 = require("../utils/uploadInvoiceToS3");
const Order = require("../models/Order");

// POST /api/order
router.post("/", async (req, res) => {
  try {
    const { customer, cart, total, vendor } = req.body;

    const vendorEmail = vendor?.email;
    const vendorPhone = vendor?.phone;

    if (!vendorEmail || !vendorPhone) {
      return res.status(400).json({
        success: false,
        message: "Vendor contact missing"
      });
    }

    /* ======================
       1️⃣ CREATE INVOICE
    ====================== */
    const invoiceBuffer = await generateInvoice({
      customer,
      cart,
      total
    });

    /* ======================
       2️⃣ UPLOAD TO S3
    ====================== */
    const invoiceUrl = await uploadInvoiceToS3(invoiceBuffer);

    /* ======================
       3️⃣ SAVE ORDER
    ====================== */
    const order = await Order.create({
      customer,
      vendor: {
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone
      },
      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total,
      invoiceUrl,
      status: "NEW"
    });

    /* ======================
       4️⃣ EMAIL
    ====================== */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS
      }
    });

    await transporter.verify();

    const itemsText = cart
      .map(
        i =>
          `${i.name} | ₹${i.price} × ${i.quantity} = ₹${
            i.price * i.quantity
          }`
      )
      .join("\n");

    const message = `
NEW ORDER RECEIVED – CIVILINK

Customer Name: ${customer.name}
Phone: ${customer.phone}
Email: ${customer.email || "N/A"}
Address:
${customer.address}

-------------------------
ORDER ITEMS:
${itemsText}

-------------------------
TOTAL: ₹${total}

Invoice:
${invoiceUrl}
`;

    await transporter.sendMail({
      from: `"Civilink Orders" <${process.env.ADMIN_EMAIL}>`,
      to: vendorEmail,
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
       5️⃣ WHATSAPP LINK
    ====================== */
    const whatsappText = encodeURIComponent(
      `New order from Civilink\n\n${message}`
    );

    const whatsappLink = `https://wa.me/${vendorPhone}?text=${whatsappText}`;

    res.json({
      success: true,
      orderId: order._id,
      whatsappLink
    });

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Order processing failed"
    });
  }
});

module.exports = router;
