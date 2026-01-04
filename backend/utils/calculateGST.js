/**
 * Calculate GST breakup for an order
 * @param {Array} items - order items
 * @param {String} vendorState
 * @param {String} deliveryState
 * @param {Number} gstRate - default 18%
 */
module.exports = function calculateGST(
  items = [],
  vendorState,
  deliveryState,
  gstRate = 18
) {
  let taxableAmount = 0;

  items.forEach(item => {
    if (item.productType === "SALE") {
      taxableAmount += item.price * item.quantity;
    }

    if (item.productType === "RENTAL") {
      taxableAmount += item.price * item.quantity * item.days;
    }
  });

  const isIntraState = vendorState === deliveryState;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isIntraState) {
    cgst = (taxableAmount * gstRate) / 200;
    sgst = (taxableAmount * gstRate) / 200;
  } else {
    igst = (taxableAmount * gstRate) / 100;
  }

  const totalTax = cgst + sgst + igst;
  const grandTotal = taxableAmount + totalTax;

  return {
    taxableAmount: round(taxableAmount),
    cgst: round(cgst),
    sgst: round(sgst),
    igst: round(igst),
    totalTax: round(totalTax),
    grandTotal: round(grandTotal),
    taxType: isIntraState ? "CGST_SGST" : "IGST",
    gstRate
  };
};

function round(num) {
  return Math.round(num * 100) / 100;
}
