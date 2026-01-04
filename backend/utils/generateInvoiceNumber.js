const InvoiceCounter = require("../models/InvoiceCounter");

module.exports = async function generateInvoiceNumber() {
  const year = new Date().getFullYear();

  const counter = await InvoiceCounter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const paddedSeq = String(counter.seq).padStart(6, "0");

  return `CL-INV-${year}-${paddedSeq}`;
};
