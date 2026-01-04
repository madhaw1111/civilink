const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

module.exports = async function generateInvoice({
  order,
  vendor,
  customer,
  items,
  gst
}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      /* =================================================
         HEADER
      ================================================= */
      const logoPath = path.join(__dirname, "../assets/logo.png");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 32, { width: 90 });
      }

      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .text("Tax Invoice / Bill of Supply", 160, 40);

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("gray")
        .text("(Original for Recipient)", 160, 60);

      doc.moveDown(2.5);
      doc.fillColor("black");

      /* =================================================
         SOLD BY / DELIVERY (STRICT TWO COLUMNS)
      ================================================= */
      const startY = doc.y;

      doc.font("Helvetica-Bold").text("Sold By", 40, startY);
      doc.font("Helvetica").text(
        `${vendor.name}
${vendor.address }
${vendor.phone}
${vendor.state}
India`,
        40,
        startY + 14,
        { width: 250 }
      );

      doc.font("Helvetica-Bold").text("Shipping Address", 320, startY);
      doc.font("Helvetica").text(
        `${customer.name}
${customer.address}
${customer.phone}
${customer.state}
India`,
        320,
        startY + 14,
        { width: 230 }
      );

      doc.y = startY + 90;

      /* =================================================
         ORDER DETAILS
      ================================================= */
      doc.font("Helvetica-Bold").text("Order & Invoice Details");
      doc.font("Helvetica").text(
        `Order Number : ${order._id}
Order Date   : ${new Date(order.createdAt).toLocaleDateString()}
Invoice No   : ${order.invoiceNumber}
Invoice Date : ${new Date().toLocaleDateString()}
Place of Supply   : ${vendor.state}
Place of Delivery : ${customer.state}`
      );

      doc.moveDown(1.2);

      /* =================================================
         TABLE HEADER
      ================================================= */
      const tableTop = doc.y + 8;

      const col = {
        sl: 40,
        desc: 70,
        price: 240,
        qty: 300,
        days: 340,
        net: 380,
        tax: 440,
        total: 500
      };

      doc.moveTo(40, tableTop - 6).lineTo(555, tableTop - 6).stroke();

      doc.font("Helvetica-Bold").fontSize(9);
      doc.text("Sl", col.sl, tableTop, { width: 20 });
      doc.text("Description", col.desc, tableTop, { width: 200 });
      doc.text("Unit Price", col.price, tableTop, { width: 50, align: "right" });
      doc.text("Qty", col.qty, tableTop, { width: 30, align: "right" });
      doc.text("Days", col.days, tableTop, { width: 30, align: "right" });
      doc.text("Net", col.net, tableTop, { width: 45, align: "right" });
      doc.text("Tax", col.tax, tableTop, { width: 35, align: "right" });
      doc.text("Total", col.total, tableTop, { width: 45, align: "right" });

      doc.moveTo(40, tableTop + 14).lineTo(555, tableTop + 14).stroke();

      doc.font("Helvetica").fontSize(9);

   /* =================================================
   TABLE ROWS (TRUE DYNAMIC HEIGHT)
================================================= */
let y = tableTop + 24;

items.forEach((item, i) => {
  const net =
    item.productType === "RENTAL"
      ? item.dailyPrice * item.quantity * item.days
      : item.price * item.quantity;

  const taxAmount = (net * gst.gstRate) / 100;

  doc.fontSize(9).fillColor("black");

  // ---- DESCRIPTION TEXT (may wrap)
  const descText = `${item.name}
${item.vendorProductCode}
${item.size ? `Size: ${item.size}` : ""}`;

  const descHeight = doc.heightOfString(descText, {
    width: 220
  });

  // ---- ROW HEIGHT = max of content
  const rowHeight = Math.max(20, descHeight + 4);

  // ---- ROW CONTENT
  doc.text(i + 1, col.sl, y, { width: 20 });

  doc.text(descText, col.desc, y, {
    width: 220
  });

  doc.text(
    item.productType === "RENTAL"
      ? `Rs.${item.dailyPrice}/day`
      : `Rs.${item.price}`,
    col.price,
    y,
    { width: 40, align: "right" }
  );

  doc.text(item.quantity, col.qty, y, { width: 20, align: "right" });
  doc.text(
    item.productType === "RENTAL" ? item.days : "-",
    col.days,
    y,
    { width: 30, align: "right" }
  );
  doc.text(`Rs.${net.toFixed(2)}`, col.net, y, {
    width: 40,
    align: "right"
  });
  doc.text(`${gst.gstRate}%`, col.tax, y, {
    width: 40,
    align: "right"
  });
  doc.text(`Rs.${(net + taxAmount).toFixed(2)}`, col.total, y, {
    width: 40,
    align: "right"
  });

  // ---- MOVE TO NEXT ROW
  y += rowHeight + 6;
});

// ---- TABLE BOTTOM LINE
doc.moveTo(40, y).lineTo(555, y).stroke();


      /* =================================================
         TOTALS
      ================================================= */
      doc
  .moveTo(40, y)
  .lineTo(555, y)
  .stroke();

y += 8;

doc.font("Helvetica-Bold");
doc.text("Grand Total", col.net, y, { width: 80, align: "right" });
doc.text(`Rs.${gst.grandTotal.toFixed(2)}`, col.total, y, { width: 40, align: "right" });

      doc.moveDown(1.5);

      /* =================================================
         TAX SUMMARY
      ================================================= */
    /* =================================================
   TAX SUMMARY (FIXED ALIGNMENT)
================================================= */
doc.moveDown(3);

const taxStartX = 340;
const labelWidth = 120;
const valueWidth = 80;
let taxY = doc.y;

doc.font("Helvetica-Bold").fontSize(10);
doc.text("Tax Summary", taxStartX, taxY);

taxY += 18;

doc.font("Helvetica").fontSize(9);

const taxRow = (label, value) => {
  doc.text(label, taxStartX, taxY, {
    width: labelWidth,
    align: "left"
  });
  doc.text(value, taxStartX + labelWidth, taxY, {
    width: valueWidth,
    align: "right"
  });
  taxY += 14;
};

taxRow("Taxable Amount", `Rs.${gst.taxableAmount.toFixed(2)}`);
taxRow("CGST", `Rs.${gst.cgst.toFixed(2)}`);
taxRow("SGST", `Rs.${gst.sgst.toFixed(2)}`);
taxRow("IGST", `Rs.${gst.igst.toFixed(2)}`);

doc.font("Helvetica-Bold");
taxRow("Grand Total", `Rs.${gst.grandTotal.toFixed(2)}`);

      /* =================================================
         FOOTER
      ================================================= */
     doc.moveDown(2);

doc
  .fontSize(8)
  .fillColor("gray")
  .text(
    "This is a computer-generated invoice.\n" +
    "Civilink is a marketplace platform and not the seller of goods or services.\n" +
    "All tax liability lies with the respective vendor.",
    40,
    doc.y,
    { width: 515, align: "center" }
  );


      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
