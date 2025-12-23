import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";
import toast from "react-hot-toast";


const CITIES = ["Chennai", "Madurai", "Coimbatore", "Karaikudi"];

const CATEGORIES = [
  { id: "raw", label: "Raw Materials" },
  { id: "furniture", label: "Furniture" },
  { id: "electrical", label: "Electrical" },
  { id: "plumbing", label: "Plumbing" },
  { id: "concrete", label: "Ready-Mix Concrete" },
  { id: "rental", label: "Rental Equipment" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products"); // "vendors" or "products"
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);

  // ===== DASHBOARD SUMMARY COUNTS (UI ONLY) =====
const totalVendors = vendors.length;
const totalProducts = products.length;
const activeProducts = products.filter(p => p.isActive).length;
const inactiveProducts = totalProducts - activeProducts;

const [logs, setLogs] = useState([]);

  const [vendorForm, setVendorForm] = useState({
    _id: null,
    name: "",
    city: "Chennai",
    address: "",
    phone: "",
    email: "",  
    isActive: true,
  });

  const [productForm, setProductForm] = useState({
    _id: null,
    name: "",
    category: "raw",
    price: "",
    unit: "",
    vendorId: "",
    city: "Chennai",
    imageUrl: "",
    isActive: true,
  });

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:5000/api/admin",
    headers: { Authorization: `Bearer ${token}` },
  });

  const loadVendors = async () => {
    const res = await api.get("/vendors");
    setVendors(res.data);
  };

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadVendors();
    loadProducts();
    // eslint-disable-next-line
  }, []);

  // --------- VENDOR HANDLERS ----------
  const handleSaveVendor = async () => {
    if (!vendorForm.name) return alert("Vendor name required");

    if (vendorForm._id) {
      await api.put(`/vendors/${vendorForm._id}`, vendorForm);
      alert("Vendor updated");
    } else {
      await api.post("/vendors", vendorForm);
     toast.success("Vendor added successfully");

    }
    setVendorForm({
      _id: null,
      name: "",
      city: "Chennai",
      address: "",
      phone: "",
      isActive: true,
    });
    loadVendors();
  };

  const handleEditVendor = (v) => {
    setVendorForm({
      _id: v._id,
      name: v.name,
      city: v.city,
      address: v.address || "",
      phone: v.phone || "",
      email: v.email || "", 
      isActive: v.isActive ?? true,
    });
    setActiveTab("vendors");
  };

  const handleDeleteVendor = async (id) => {
    if (!window.confirm("Delete this vendor?")) return;
    await api.delete(`/vendors/${id}`);
    loadVendors();
  };

  // --------- PRODUCT HANDLERS ----------
  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.vendorId) {
      return alert("Product name & vendor are required");
    }

    const payload = {
      name: productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      unit: productForm.unit,
      vendorId: productForm.vendorId,
      city: productForm.city,
      imageUrl: productForm.imageUrl,
      isActive: productForm.isActive,
    };

    if (productForm._id) {
      await api.put(`/products/${productForm._id}`, payload);
      alert("Product updated");
    } else {
      await api.post("/products", payload);
      alert("Product added");
    }

    setProductForm({
      _id: null,
      name: "",
      category: "raw",
      price: "",
      unit: "",
      vendorId: "",
      city: "Chennai",
      imageUrl: "",
      isActive: true,
    });
    loadProducts();
  };

  const handleEditProduct = (p) => {
    setProductForm({
      _id: p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      unit: p.unit,
      vendorId: p.vendor?._id || "",
      city: p.city,
      imageUrl: p.imageUrl || "",
      isActive: p.isActive ?? true,
    });
    setActiveTab("products");
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const loadLogs = async () => {
  const res = await api.get("/logs");
  setLogs(res.data);
};


  // --------- RENDER ----------
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">Civilink Admin</div>
        <div
          className={
            "admin-nav-item " + (activeTab === "products" ? "active" : "")
          }
          onClick={() => setActiveTab("products")}
        >
          Products
        </div>
        <div
          className={
            "admin-nav-item " + (activeTab === "vendors" ? "active" : "")
          }
          onClick={() => setActiveTab("vendors")}
        >
          Vendors
        </div>
        <div
  className={"admin-nav-item " + (activeTab === "logs" ? "active" : "")}
  onClick={() => setActiveTab("logs")}
>
  Activity Logs
</div>

      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h2>Marketplace Control</h2>
          <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
            Logged in as <b>Admin</b>
          </span>
        </div>

        {activeTab === "vendors" && (
          <>
            <section className="admin-card">
              <h3>{vendorForm._id ? "Edit Vendor" : "Add Vendor"}</h3>
              <div className="admin-form">
                <input
                  placeholder="Vendor name"
                  value={vendorForm.name}
                  onChange={(e) =>
                    setVendorForm({ ...vendorForm, name: e.target.value })
                  }
                />
                <select
                  value={vendorForm.city}
                  onChange={(e) =>
                    setVendorForm({ ...vendorForm, city: e.target.value })
                  }
                >
                  {CITIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <input
                  placeholder="Address"
                  value={vendorForm.address}
                  onChange={(e) =>
                    setVendorForm({ ...vendorForm, address: e.target.value })
                  }
                />
                <input
                  placeholder="Phone"
                  value={vendorForm.phone}
                  onChange={(e) =>
                    setVendorForm({ ...vendorForm, phone: e.target.value })
                  }
                />
                <input
                  placeholder="Email (Gmail)"
                  value={vendorForm.email}
                  onChange={(e) =>
                   setVendorForm({ ...vendorForm, email: e.target.value })
                  }
                />

              </div>
              <button className="admin-primary-btn" onClick={handleSaveVendor}>
                {vendorForm._id ? "Update Vendor" : "Add Vendor"}
              </button>
            </section>

            <section className="admin-card">
              <h3>Vendors</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>City</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v) => (
                    <tr key={v._id}>
                      <td>{v.name}</td>
                      <td>{v.city}</td>
                      <td>{v.phone}</td>
                      <td>{v.email}</td>

                      <td>
                        <button
                          className="admin-secondary-btn"
                          onClick={() => handleEditVendor(v)}
                        >
                          Edit
                        </button>{" "}
                        <button
                          className="admin-secondary-btn"
                          onClick={() => handleDeleteVendor(v._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {vendors.length === 0 && (
                    <tr>
                      <td colSpan="4">No vendors yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </>
        )}

        {activeTab === "products" && (
          <>
            <section className="admin-card">
              <h3>{productForm._id ? "Edit Product" : "Add Product"}</h3>
              <div className="admin-form">
                <input
                  placeholder="Product name"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                />
                <select
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Price"
                  type="number"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                />
                <input
                  placeholder="Unit (e.g., per bag)"
                  value={productForm.unit}
                  onChange={(e) =>
                    setProductForm({ ...productForm, unit: e.target.value })
                  }
                />
                <select
                  value={productForm.vendorId}
                  onChange={(e) =>
                    setProductForm({ ...productForm, vendorId: e.target.value })
                  }
                >
                  <option value="">Select vendor</option>
                  {vendors.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name} - {v.city}
                    </option>
                  ))}
                </select>
                <select
                  value={productForm.city}
                  onChange={(e) =>
                    setProductForm({ ...productForm, city: e.target.value })
                  }
                >
                  {CITIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <input
                  placeholder="Image URL"
                  value={productForm.imageUrl}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      imageUrl: e.target.value,
                    })
                  }
                />
              </div>
              <button
                className="admin-primary-btn"
                onClick={handleSaveProduct}
              >
                {productForm._id ? "Update Product" : "Add Product"}
              </button>
            </section>

            <section className="admin-card">
              <h3>Products</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Vendor</th>
                    <th>City</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="admin-product-image"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{p.name}</td>
                      <td>{p.vendor?.name}</td>
                      <td>{p.city}</td>
                      <td>{p.category}</td>
                      <td>₹{p.price}</td>
                      <td>
                        <button
                          className="admin-secondary-btn"
                          onClick={() => handleEditProduct(p)}
                        >
                          Edit
                        </button>{" "}
                        <button
                          className="admin-secondary-btn"
                          onClick={() => handleDeleteProduct(p._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="7">No products yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </>
        )}
        {activeTab === "logs" && (
  <section className="admin-card">
    <h3>Admin Activity Logs</h3>

    <table className="admin-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Action</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        {logs.length === 0 ? (
          <tr>
            <td colSpan="3">No admin activity yet.</td>
          </tr>
        ) : (
          logs.map((log) => (
            <tr key={log._id}>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>{log.action}</td>
              <td>{log.description}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </section>
)}

      </main>
    </div>
  );
}
