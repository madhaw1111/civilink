import React from "react";

export default function CartModal({
  cart = [],
  setCart,
  onClose,
  onCheckout
}) {
  // ✅ SAFE total calculation (SALE + RENTAL)
  const totalAmount = cart.reduce((sum, item) => {
    if (item.productType === "SALE") {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }

    if (item.productType === "RENTAL") {
      const dailyPrice = Number(item.dailyPrice) || 0;
      const qty = Number(item.quantity) || 1;
      const days = Number(item.days) || 1;
      return sum + dailyPrice * qty * days;
    }

    return sum;
  }, 0);

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
              {/* LEFT */}
              <div>
                <div>{item.name}</div>

                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {item.vendorProductCode}
                </div>

                <div style={{ fontSize: 12 }}>
                  {item.productType === "SALE" && (
                    <>
                      ₹{item.price} × {item.quantity} {item.unit}
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

              {/* RIGHT (quantity + days selector wrapped) */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* QUANTITY */}
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

                {/* 🔥 DAYS SELECTOR (RENTAL ONLY) */}
                {item.productType === "RENTAL" && (
                  <div style={{ marginTop: 6, fontSize: 12 }}>
                    <button
                      onClick={() =>
                        setCart((prev) =>
                          prev.map((p) =>
                            p._id === item._id
                              ? { ...p, days: Math.max(1, (p.days || 1) - 1) }
                              : p
                          )
                        )
                      }
                    >
                      −
                    </button>

                    <span style={{ margin: "0 6px" }}>
                      {item.days || 1} day{(item.days || 1) > 1 ? "s" : ""}
                    </span>

                    <button
                      onClick={() =>
                        setCart((prev) =>
                          prev.map((p) =>
                            p._id === item._id
                              ? { ...p, days: (p.days || 1) + 1 }
                              : p
                          )
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {cart.length > 0 && (
          <>
            <div className="cart-summary">
              Total: ₹{totalAmount}
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
