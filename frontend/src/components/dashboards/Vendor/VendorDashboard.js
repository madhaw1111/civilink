// frontend/src/components/dashboards/VendorDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./vendor.css";
import CartModal from "./CartModal";
import CheckoutModal from "./CheckoutModal";


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
 // My Orders (Customer)
const [showMyOrders, setShowMyOrders] = useState(false);
const [customerOrders, setCustomerOrders] = useState([]);






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


  const submitOrder = async () => {
  try {
    if (!checkoutData.name || !checkoutData.phone || !checkoutData.address) {
      alert("Please fill all required fields");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    // 🔑 assume all items belong to same vendor
    const vendor = cart[0]?.vendor;

    if (!vendor?.email || !vendor?.phone) {
     

      alert("Vendor contact details missing");
      return;
    }

   const total = cart.reduce((sum, item) => {
  if (item.productType === "RENTAL") {
    const daily = Number(item.dailyPrice) || 0;
    const qty = Number(item.quantity) || 1;
    const days = Number(item.days) || 1;
    return sum + daily * qty * days;
  }

  const price = Number(item.price) || 0;
  const qty = Number(item.quantity) || 1;
  return sum + price * qty;
}, 0);


    const res = await axios.post(
      "http://localhost:5000/api/order",
      {
        customer: checkoutData,
        cart: cart.map(item => ({
  productId: item._id,                 // internal
  productCode: item.vendorProductCode, // business ID
  name: item.name,
  productType: item.productType,
  price: item.price,
  quantity: item.quantity,
  days:
    item.productType === "RENTAL"
      ? item.days
      : undefined
})),
        total,
        vendor: {
          name: vendor.name,
          email: vendor.email,
          phone: vendor.phone
        }
      }
    );

    if (!res.data.success) {
      alert("Order failed. Try again.");
      return;
    }

    // ✅ Open WhatsApp if backend sent link
    if (res.data.whatsappLink) {
      window.open(res.data.whatsappLink, "_blank");
    }

    alert("Order placed successfully");

    // ✅ Cleanup
    setCart([]);
    localStorage.removeItem("vendorCart");
    setShowCheckout(false);

  } catch (err) {
    console.error("Order submit error:", err);
    alert("Server error while placing order");
  }
};

const loadMyOrders = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/customer/orders/my",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setCustomerOrders(res.data.orders);
  } catch (err) {
    console.error("Load my orders failed", err);
  }
};



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

    <button
  className="vendor-menu-item"
  onClick={() => {
    setShowMyOrders(true);
    loadMyOrders();
    setShowMenu(false);
  }}
>
  My Orders
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
          <strong>whatsApp:</strong>{" "}
          <a href="https://wa.me/919384710710?text=Hi%20I%20found%20this%20on%20Civilink"
      target="_blank"
      rel="noopener noreferrer"
          
          >+91 9384710710</a>
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
              {/* PRODUCT IMAGE */}
{p.imageUrl ? (
  <img
    src={p.imageUrl}
    alt={p.name}
    className="vendor-card-image"
  />
) : (
  <div className="vendor-card-image placeholder">
    No Image
  </div>
)}

              <div className="vendor-card-header">
                <div className="vendor-product-name">{p.name}</div>
                <div className="vendor-product-id">
  {p.vendorProductCode}
</div>

              </div>
              <div className="vendor-price">
  {/* SALE PRODUCTS */}
  {p.productType === "SALE" && (
    <>
      {p.variants && p.variants.length > 0 ? (
        <>
          ₹{Math.min(...p.variants.map(v => v.price))}{" "}
          <span className="vendor-unit">
            / {p.unit || "unit"} (from)
          </span>
        </>
      ) : (
        <>
          ₹{p.price}{" "}
          <span className="vendor-unit">
            {p.unit}
          </span>
        </>
      )}
    </>
  )}

  {/* RENTAL PRODUCTS */}
  {p.productType === "RENTAL" && (
    <>
      ₹{Math.min(...p.variants.map(v => v.dailyPrice))}{" "}
      <span className="vendor-unit">
        / day (from)
      </span>
    </>
  )}
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
  const basePrice =
    p.productType === "SALE"
      ? p.variants && p.variants.length > 0
        ? Math.min(...p.variants.map(v => v.price))
        : p.price
      : Math.min(...p.variants.map(v => v.dailyPrice));

  return [
  ...prev,
  {
    _id: p._id,
    name: p.name,
    vendorProductCode: p.vendorProductCode,
    vendor: p.vendor,

    productType: p.productType,

    // 🔥 IMPORTANT FIX
    price: p.productType === "SALE"
      ? basePrice
      : undefined,

    dailyPrice: p.productType === "RENTAL"
      ? basePrice
      : undefined,

    quantity: 1,
    days: p.productType === "RENTAL" ? 1 : undefined,

    unit: p.unit,
    size: p.size
  }
];

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
  <strong>Price:</strong>{" "}
  {selectedProduct.productType === "SALE" ? (
    selectedProduct.variants?.length ? (
      <>From ₹{Math.min(...selectedProduct.variants.map(v => v.price))}</>
    ) : (
      <>₹{selectedProduct.price}</>
    )
  ) : (
    <>From ₹{Math.min(...selectedProduct.variants.map(v => v.dailyPrice))} / day</>
  )}
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

 

  
  
  {showAddedMsg && (
    <div className="vendor-toast">
      ✅ Item added to cart
    </div>
  )}

{showCart && (
  <CartModal
    cart={cart}
    setCart={setCart}
    onClose={() => setShowCart(false)}
    onCheckout={() => {
      setShowCart(false);
      setShowCheckout(true);
    }}
  />
)}

{/* ✅ CHECKOUT MODAL */}
{showCheckout && (
  <CheckoutModal
    cart={cart}
    checkoutData={checkoutData}
    setCheckoutData={setCheckoutData}
    onBack={() => {
      setShowCheckout(false);
      setShowCart(true); // ✅ go back to cart
    }}
    onSubmit={submitOrder}  
  />

  )}

 {showMyOrders && (
  <section className="vendor-orders">
    <h3>My Orders</h3>

    {customerOrders.length === 0 ? (
      <p>No orders yet.</p>
    ) : (
      <table className="vendor-orders-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Invoice</th>
          </tr>
        </thead>

        <tbody>
          {customerOrders.map(order => (
            <tr key={order._id}>
              <td>
                {new Date(order.createdAt).toLocaleString()}
              </td>

              <td>
                <strong>{order.customer.name}</strong>
              </td>

              <td>
                {order.items.map((i, idx) => (
                  <div key={idx}>
                    {i.name} × {i.quantity}
                  </div>
                ))}
              </td>

              <td>₹{order.total}</td>

              <td>{order.status || "Placed"}</td>

              <td>
                {order.invoiceUrl ? (
                  <a
                    href={order.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </section>
)}


 
    </div>
  );
}


export default VendorDashboard;
