import React from "react";

export default function CheckoutModal({
  cart,
  checkoutData,
  setCheckoutData,
  onBack,
  onSubmit
}) {
  return (
    <div className="vendor-modal-overlay" onClick={onBack}>
      <div
        className="vendor-modal-content checkout-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Checkout Details</h3>

        <input
          placeholder="Customer Name"
          value={checkoutData.name}
          onChange={(e) =>
            setCheckoutData({
              ...checkoutData,
              name: e.target.value
            })
          }
        />

        <input
          placeholder="Phone Number"
          value={checkoutData.phone}
          onChange={(e) =>
            setCheckoutData({
              ...checkoutData,
              phone: e.target.value
            })
          }
        />

        <input
          placeholder="Email (optional)"
          value={checkoutData.email}
          onChange={(e) =>
            setCheckoutData({
              ...checkoutData,
              email: e.target.value
            })
          }
        />

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

        <div className="cart-summary">
          Total Amount: ₹
          {cart.reduce(
            (sum, item) =>
              sum + item.price * item.quantity,
            0
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-outline" onClick={onBack}>
            Back
          </button>

          <button className="btn-primary" onClick={onSubmit}>
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
}
