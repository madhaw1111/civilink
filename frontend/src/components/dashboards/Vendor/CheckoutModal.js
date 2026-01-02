// frontend/src/components/dashboards/CheckoutModal.js
import React from "react";

export default function CheckoutModal({
  cart = [],
  checkoutData,
  setCheckoutData,
  onBack,
  onSubmit
}) {
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="vendor-modal-overlay">
      {/* MODAL CONTENT */}
      <div
        className="vendor-modal-content checkout-modal"
        onClick={(e) => e.stopPropagation()} // ✅ prevent overlay conflict
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

        {/* TOTAL */}
        <div className="cart-summary">
          Total Amount: ₹{totalAmount}
        </div>

        {/* ACTION BUTTONS */}
        <div className="modal-actions">
          <button
            className="btn-outline"
            type="button"
            onClick={onBack} // ✅ Back now works correctly
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
