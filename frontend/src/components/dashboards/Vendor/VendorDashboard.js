// frontend/src/components/dashboards/VendorDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./vendor.css";

function VendorDashboard() {
  const CATEGORIES = [
    { id: "raw", label: "Raw Materials" },
    { id: "furniture", label: "Furniture" },
    { id: "electrical", label: "Electrical" },
    { id: "plumbing", label: "Plumbing" },
    { id: "concrete", label: "Ready-Mix Concrete" },
    { id: "rental", label: "Rental Equipment" },
  ];

  const CITIES = ["All Cities", "Chennai", "Coimbatore", "Madurai", "Salem"];

  const [selectedCategory, setSelectedCategory] = useState("raw");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showAddedMsg, setShowAddedMsg] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
  name: "",
  phone: "",
  email: "",
  address: "",
  });





  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/products/all");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

    // Load cart from localStorage when page opens
  useEffect(() => {
  const savedCart = localStorage.getItem("vendorCart");
  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
  }, []);
 
  // Save cart to localStorage whenever it changes
  useEffect(() => {
  localStorage.setItem("vendorCart", JSON.stringify(cart));
  }, [cart]);


  const filteredProducts = products.filter((p) => {
    return (
      (selectedCity === "All Cities" || p.city === selectedCity) &&
      p.category?.toLowerCase() === selectedCategory.toLowerCase() &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="vendor-page">
      {/* Top Bar */}
      <header className="vendor-header">
        <div className="vendor-left">
  <button
    className="vendor-menu-btn"
    onClick={() => setShowMenu(!showMenu)}
  >
    ☰
  </button>
  <div className="vendor-logo">Civilink Vendor</div>
</div>


        <div className="vendor-search">
          <input
            type="text"
            placeholder="Search materials, vendors…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="vendor-actions">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city === "All Cities" ? "All Locations" : city}
              </option>
            ))}
          </select>
          <button
           className="vendor-cart-btn"
          onClick={() => setShowCart(true)}
>
           🛒
         {cart.length > 0 && (
            <span className="vendor-cart-badge">
         {cart.reduce((sum, i) => sum + i.quantity, 0)}
        </span>
       )}

       </button>


        </div>
      </header>
      {showMenu && (
  <div className="vendor-menu">
    <button
      className="vendor-menu-item"
      onClick={() => {
        window.location.href = "/admin";
      }}
    >
      Admin Panel
    </button>

    <button
     className="vendor-menu-item"
     onClick={() => {
    setShowContact(true);
    setShowMenu(false);
      }}
    >
     Contact
    </button>

  </div>
)}

      {/* Category Strip */}
      <div className="vendor-categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={
              cat.id === selectedCategory
                ? "vendor-category active"
                : "vendor-category"
            }
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {showContact && (
  <div className="vendor-modal-overlay">
    <div className="vendor-modal">
      <div className="vendor-modal-header">
        <h3>Contact Admin</h3>
        <button
          className="vendor-modal-close"
          onClick={() => setShowContact(false)}
        >
          ✕
        </button>
      </div>

      <div className="vendor-modal-body">
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:civilink.official@gmail.com">
            civilink.official@gmail.com
          </a>
        </p>
        <p>
          <strong>Phone:</strong>{" "}
          <a href="tel:+919384710710">+91 9384710710</a>
        </p>
        <p className="vendor-modal-note">
          Our admin team will guide you with construction materials,
          vendors, and pricing.
        </p>
      </div>
    </div>
  </div>
)}


      {/* Info Banner */}
      <section className="vendor-banner">
        <h2>
          {selectedCategory === "raw" && "Raw Materials for Your Site"}
          {selectedCategory === "furniture" &&
            "Construction-Grade Furniture"}
          {selectedCategory === "electrical" &&
            "Safe & Reliable Electrical Materials"}
          {selectedCategory === "plumbing" &&
            "Plumbing Pipes & Fittings"}
          {selectedCategory === "concrete" && "Ready-Mix Concrete Supply"}
          {selectedCategory === "rental" &&
            "Rental Shuttering & Equipment"}
        </h2>
        <p>
          Showing best options{" "}
          {selectedCity === "All Cities"
            ? "across all locations."
            : `available in ${selectedCity}.`}
        </p>
      </section>

      {/* Product Grid */}
      <main className="vendor-products">
        {filteredProducts.length === 0 ? (
          <div className="vendor-empty">
            No products found for this filter. Try another city or search term.
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div key={p._id} className="vendor-card">
              <div className="vendor-card-header">
                <div className="vendor-product-name">{p.name}</div>
                <div className="vendor-product-id">#{p._id}</div>
              </div>

              <div className="vendor-price">
                ₹{p.price}{" "}
                <span className="vendor-unit">{p.unit}</span>
              </div>

              <div className="vendor-meta">
                <div className="vendor-vendor-name">{p.vendor?.name}</div>
                <div className="vendor-city">{p.city}</div>
              </div>

              <div className="vendor-tags">
                <span className="tag-primary">In stock</span>
              </div>

              <div className="vendor-actions-row">
                <button
              className="btn-primary"
               onClick={() => {
              setCart((prev) => {
  const existing = prev.find((item) => item._id === p._id);

  if (existing) {
    return prev.map((item) =>
      item._id === p._id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    return [...prev, { ...p, quantity: 1 }];
  }
});

              setShowAddedMsg(true);
              setTimeout(() => setShowAddedMsg(false), 1200);
            }}
            >
            Add to Cart
          </button>


                <button
  className="btn-outline"
  onClick={() => setSelectedProduct(p)}
>
  View Details
</button>

              </div>
            </div>
          ))
        )}
      </main>

    {selectedProduct && (
  <div className="vendor-modal-overlay">
    <div className="vendor-modal">
      <div className="vendor-modal-header">
        <h3>{selectedProduct.name}</h3>
        <button
          className="vendor-modal-close"
          onClick={() => setSelectedProduct(null)}
        >
          ✕
        </button>
      </div>

      <div className="vendor-modal-body">
        {selectedProduct.imageUrl && (
          <img
            src={selectedProduct.imageUrl}
            alt={selectedProduct.name}
            className="vendor-product-image"
          />
        )}

        <p>
          <strong>Price:</strong> ₹{selectedProduct.price}{" "}
          <span className="vendor-unit">{selectedProduct.unit}</span>
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {selectedProduct.category}
        </p>

        <p>
          <strong>Vendor:</strong>{" "}
          {selectedProduct.vendor?.name}
        </p>

        <p>
          <strong>City:</strong> {selectedProduct.city}
        </p>

        <p className="vendor-modal-note">
          For bulk orders or negotiation, please contact admin.
        </p>
      </div>
    </div>
  </div>
)}  

    <>
  {showCart && (
    <div className="vendor-modal">
      <div className="vendor-modal-overlay" onClick={() => setShowCart(false)} />

      <div className="vendor-modal-content">
        <h3>Your Cart</h3>

        <div className="vendor-modal-body">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <div>{item.name}</div>
                  <div style={{ fontSize: "12px" }}>
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

                  <span style={{ margin: "0 8px" }}>{item.quantity}</span>

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
        </div>
      </div>
    </div>
  )}
  
  
  {showAddedMsg && (
    <div className="vendor-toast">
      ✅ Item added to cart
    </div>
  )}
</>
<div className="vendor-modal-body">
{cart.length === 0 ? (
  <p>Your cart is empty.</p>
) : (
  cart.map((item) => (
    <div
      key={item._id}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
      <div>
        <div>{item.name}</div>
        <div style={{ fontSize: "12px", color: "#555" }}>
          ₹{item.price} × {item.quantity} = ₹
          {item.price * item.quantity}
        </div>
      </div>

      <div style={{ display: "flex", gap: "6px" }}>
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
          {"-"}
        </button>

        <span>{item.quantity}</span>

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
          {"+"}
        </button>
      </div>
    </div>
  ))
)}
 
  {/* ✅ BILL SUMMARY */}
  {cart.length > 0 && (
    <div
      className="cart-summary"
      style={{
        marginTop: "10px",
        fontWeight: "600",
        textAlign: "right",
      }}
    >
      Total: ₹
      {cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )}
    </div>
  )}

  {/* ✅ CHECKOUT BUTTON */}
  {cart.length > 0 && (
  <button
  className="btn-primary"
  onClick={() => {
    setShowCart(false);      // ✅ close cart
    setShowCheckout(true);  // ✅ open checkout
  }}
>
  Proceed to Checkout
</button>

  )}
</div>


 

{showCheckout && (
  <div className="vendor-modal-overlay">
    <div className="vendor-modal checkout-modal">
      <h3>Checkout Details</h3>

      <input
        placeholder="Customer Name"
        value={checkoutData.name}
        onChange={(e) =>
          setCheckoutData({ ...checkoutData, name: e.target.value })
        }
      />

      <input
        placeholder="Phone Number"
        value={checkoutData.phone}
        onChange={(e) =>
          setCheckoutData({ ...checkoutData, phone: e.target.value })
        }
      />

      <input
        placeholder="Email (optional)"
        value={checkoutData.email}
        onChange={(e) =>
          setCheckoutData({ ...checkoutData, email: e.target.value })
        }
      />

      <textarea
        placeholder="Delivery Address"
        value={checkoutData.address}
        onChange={(e) =>
          setCheckoutData({ ...checkoutData, address: e.target.value })
        }
      />

       {/* ✅ TOTAL AMOUNT */}
  <div className="cart-summary">
    Total Amount: ₹
    {cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )}
  </div>

  {/* ✅ BUTTONS — PUT THIS AFTER TOTAL */}
  <div className="modal-actions">
    <button
      className="btn-outline"
      onClick={() => setShowCheckout(false)}
    >
      Back
    </button>

    <button
      className="btn-primary"
      onClick={() => alert("Order submitted")}
    >
      Submit Order
    </button>
  </div>
</div>
  </div>
)}



    </div>
  );
}

export default VendorDashboard;
