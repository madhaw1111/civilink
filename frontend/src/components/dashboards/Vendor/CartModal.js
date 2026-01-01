import React from "react";

export default function CartModal({
  cart,
  setCart,
  onClose,
  onCheckout
}) {
  return (
    <div className="vendor-modal-overlay" onClick={onClose}>
      <div
        className="vendor-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Your Cart</h3>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10
              }}
            >
              <div>
                <div>{item.name}</div>
                <div style={{ fontSize: 12 }}>
                  ₹{item.price} × {item.quantity}
                </div>
              </div>

              <div>
                <button
                  onClick={() =>
                    setCart((prev) =>
                      prev
                        .map((p) =>
                          p._id === item._id
                            ? { ...p, quantity: p.quantity - 1 }
                            : p
                        )
                        .filter((p) => p.quantity > 0)
                    )
                  }
                >
                  -
                </button>

                <span style={{ margin: "0 8px" }}>
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    setCart((prev) =>
                      prev.map((p) =>
                        p._id === item._id
                          ? { ...p, quantity: p.quantity + 1 }
                          : p
                      )
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}

        {cart.length > 0 && (
          <>
            <div className="cart-summary">
              Total: ₹
              {cart.reduce(
                (sum, item) =>
                  sum + item.price * item.quantity,
                0
              )}
            </div>

            <button
              className="btn-primary"
              onClick={onCheckout}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
