// backend/utils/generateInvoice.js
const PDFDocument = require("pdfkit");

module.exports = function generateInvoice({ customer, cart, total }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer); // ✅ BUFFER
      });

      /* ===== PDF CONTENT ===== */
      doc.fontSize(18).text("CIVILINK INVOICE", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Customer: ${customer.name}`);
      doc.text(`Phone: ${customer.phone}`);
      doc.text(`Address: ${customer.address}`);
      doc.moveDown();

      doc.text("Items:");
      cart.forEach(item => {
        doc.text(
          `${item.name} - ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}`
        );
      });

      doc.moveDown();
      doc.fontSize(14).text(`Total: ₹${total}`, { align: "right" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
