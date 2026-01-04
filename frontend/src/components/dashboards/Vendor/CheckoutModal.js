import React from "react";

export default function CheckoutModal({
  cart = [],
  checkoutData,
  setCheckoutData,
  onBack,
  onSubmit
}) {
  // ✅ SAFE total calculation (SALE + RENTAL)
  const totalAmount = cart.reduce((sum, item) => {
    if (item.productType === "SALE") {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }

    if (item.productType === "RENTAL") {
      const daily = Number(item.dailyPrice) || 0;
      const qty = Number(item.quantity) || 1;
      const days = Number(item.days) || 1; // 🔥 fallback
      return sum + daily * qty * days;
    }

    return sum;
  }, 0);

  return (
    <div className="vendor-modal-overlay">
      <div
        className="vendor-modal-content checkout-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Checkout Details</h3>

        {/* CUSTOMER NAME */}
        <input
          type="text"
          placeholder="Customer Name"
          value={checkoutData.name}
          onChange={(e) =>
            setCheckoutData({
              ...checkoutData,
              name: e.target.value
            })
          }
        />

        {/* PHONE */}
        <input
          type="tel"
          placeholder="Phone Number"
          value={checkoutData.phone}
          onChange={(e) =>
            setCheckoutData({
              ...checkoutData,
              phone: e.target.value
            })
          }
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email (optional)"
          value={checkoutData.email}
          onChange={(e) =>
            setCheckoutData({
              ...checkoutData,
              email: e.target.value
            })
          }
        />

        {/* ADDRESS */}
        <textarea
          placeholder="Delivery Address"
          value={checkoutData.address}
          onChange={(e) =>
            setCheckoutData({
              ...checkoutData,
              address: e.target.value
            })
          }
        />

        <input
  type="text"
  placeholder="State (e.g. Tamil Nadu)"
  value={checkoutData.state}
  onChange={(e) =>
    setCheckoutData({ ...checkoutData, state: e.target.value })
  }
/>


        {/* ORDER ITEMS SUMMARY */}
        <div style={{ marginBottom: 16 }}>
          <h4 style={{ marginBottom: 8 }}>Order Items</h4>

          {cart.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                marginBottom: 6
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {item.vendorProductCode}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                {item.productType === "SALE" && (
                  <>
                    ₹{item.price} × {item.quantity}
                    {item.unit && ` ${item.unit}`}
                    {item.size && ` (${item.size})`}
                  </>
                )}

                {item.productType === "RENTAL" && (
                  <>
                    ₹{item.dailyPrice} × {item.quantity} ×{" "}
                    {item.days || 1} days
                    {item.size && ` (${item.size})`}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="cart-summary">
          Total Amount: ₹{totalAmount}
        </div>

        {/* ACTION BUTTONS */}
        <div className="modal-actions">
          <button
            className="btn-outline"
            type="button"
            onClick={onBack}
          >
            Back
          </button>

          <button
            className="btn-primary"
            type="button"
            onClick={onSubmit}
            disabled={!checkoutData.name || !checkoutData.phone}
          >
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
}
