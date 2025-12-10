const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST /api/order
router.post("/", async (req, res) => {
  try {
    const { customer, cart, total, vendorEmail } = req.body;

    // ✅ Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    // ✅ Build order message
    const itemsText = cart
      .map(
        (i) =>
          `${i.name} | ₹${i.price} × ${i.quantity} = ₹${
            i.price * i.quantity
          }`
      )
      .join("\n");

    const message = `
NEW ORDER RECEIVED

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

Please contact customer and arrange delivery.
`;

    await transporter.sendMail({
      from: `"Civilink Orders" <${process.env.ADMIN_EMAIL}>`,
      to: vendorEmail,
      cc: process.env.ADMIN_EMAIL,
      subject: "New Order from Civilink",
      text: message,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order email failed" });
  }
});

module.exports = router;
