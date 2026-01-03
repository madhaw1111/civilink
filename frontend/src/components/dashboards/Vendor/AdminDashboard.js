// src/components/dashboards/Vendor/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";
import toast from "react-hot-toast";
import ProductForm from "./adminproducts/ProductForm";
import ProductList from "./adminproducts/ProductList";

import VendorForm from "./adminvendors/VendorForm";
import VendorList from "./adminvendors/VendorList";

import {
  createVendorApi,
  loadVendors,
  saveVendor,
  deleteVendor
} from "./adminvendors/VendorService";

import {
  loadProducts,
  saveProduct,
  deleteProduct
} from "./adminproducts/ProductService";




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
  const [feedbacks, setFeedbacks] = useState([]);
  const [posts, setPosts] = useState([]);
  const [orders, setOrders] = useState([]);





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
    image: "",
    gstNumber: "",
    isActive: true,
  });

  const [productForm, setProductForm] = useState({
    _id: null,
    name: "",
    category: "raw",
    productType: "SALE",
    price: "",
    unit: "",
    vendorId: "",
    city: "Chennai",
    imageUrl: "",
     variants: [],
    isActive: true,
  });

  const token = localStorage.getItem("token");
  const vendorApi = createVendorApi(token);
 
  const api = axios.create({
  baseURL: "http://localhost:5000/api/admin",
  headers: { Authorization: `Bearer ${token}` }
});


 const loadFeedbacks = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/feedback/admin",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );
  setFeedbacks(res.data);
};

const loadPosts = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/post",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );
  setPosts(res.data);
};

const loadOrders = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/admin/orders",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );
  setOrders(res.data);
};



  useEffect(() => {
    loadVendors(vendorApi, setVendors);
    loadProducts(vendorApi, setProducts);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
  if (activeTab === "logs") {
    loadLogs();
  }
}, [activeTab]);

useEffect(() => {
  if (activeTab === "feedback") {
    loadFeedbacks();
  }
}, [activeTab]);

useEffect(() => {
  if (activeTab === "posts") {
    loadPosts();
  }
}, [activeTab]);

useEffect(() => {
  if (activeTab === "orders") {
    loadOrders();
  }
}, [activeTab]);




  // --------- VENDOR HANDLERS ----------
  const handleSaveVendor = async () => {
    

// GST validation (optional but recommended)
if (vendorForm.gstNumber) {
  const gstRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (!gstRegex.test(vendorForm.gstNumber)) {
    return alert("Invalid GST number");
  }
}

const isDuplicate = vendors.some(v => {
  if (!v?.name || !vendorForm?.name) return false;

  return (
    v.name.trim().toLowerCase() ===
      vendorForm.name.trim().toLowerCase() &&
    v.city === vendorForm.city &&
    v._id !== vendorForm._id
  );
});

if (isDuplicate) {
  return alert("Vendor already exists in this city");
}

  if (!vendorForm.name) return alert("Vendor name required");

  await saveVendor(vendorApi, vendorForm);

  setVendorForm({
    _id: null,
    name: "",
    city: "Chennai",
    address: "",
    phone: "",
    email: "",
    isActive: true
  });

  loadVendors(vendorApi, setVendors);
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
  await deleteVendor(vendorApi, id);
  loadVendors(vendorApi, setVendors);
};


  // --------- PRODUCT HANDLERS ----------
 const handleSaveProduct = async () => {
  if (!productForm.name || !productForm.vendorId) {
    return alert("Product name & vendor are required");
  }

  if (
    productForm.productType === "RENTAL" &&
    (!productForm.variants || productForm.variants.length === 0)
  ) {
    return alert("Rental products must have at least one size variant");
  }

  // ✅ BUILD CLEAN PAYLOAD (CRITICAL)
  const payload = {
    name: productForm.name,
    category: productForm.category,
    productType: productForm.productType,
    vendorId: productForm.vendorId,
    city: productForm.city,
    imageUrl: productForm.imageUrl,
    isActive: true,

   variants:
  productForm.productType === "RENTAL"
    ? productForm.variants.map(v => ({
        size: v.size,
        quantity: Number(v.quantity),
        dailyPrice: Number(v.dailyPrice)
      }))
    : [],

    price:
      productForm.productType === "SALE"
        ? Number(productForm.price)
        : undefined,

    unit:
      productForm.productType === "SALE"
        ? productForm.unit
        : undefined
  };

 await saveProduct(vendorApi, { ...payload, _id: productForm._id });

  loadProducts(vendorApi, setProducts);

  // reset form
  setProductForm({
    _id: null,
    name: "",
    category: "raw",
    productType: "SALE",
    price: "",
    unit: "",
    vendorId: "",
    city: "Chennai",
    imageUrl: "",
    variants: [],
    isActive: true
  });
};
 const handleEditProduct = (p) => {
    setProductForm({
      _id: p._id,
      name: p.name,
      category: p.category,
      productType: p.productType,
      price: p.price || "",
      unit: p.unit || "",
      vendorId: p.vendor?._id || "",
      city: p.city,
      imageUrl: p.imageUrl || "",
      variants: p.variants || [],
      isActive: p.isActive ?? true
    });
    setActiveTab("products");
  };


  const handleDeleteProduct = async (id) => {
  if (!window.confirm("Delete this product?")) return;
  await deleteProduct(vendorApi, id);
  loadProducts(vendorApi, setProducts);
};

const uploadProductImage = async (productId, file) => {
    if (!file || !productId) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
      `http://localhost:5000/api/admin/products/${productId}/image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setProductForm(prev => ({
    ...prev,
    imageUrl: res.data.product.imageUrl
  }));

    loadProducts(vendorApi, setProducts);
    return res.data.product.imageUrl;
  };


  const loadLogs = async () => {
  const res = await api.get("/logs");
  setLogs(res.data);
};


const handleDeleteFeedback = async (id) => {
  if (!window.confirm("Delete this feedback?")) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/feedback/admin/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setFeedbacks(prev => prev.filter(f => f._id !== id));
    toast.success("Feedback deleted");
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete feedback");
  }
};


const handleDeletePost = async (id) => {
  if (!window.confirm("Delete this post?")) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/post/admin/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setPosts(prev => prev.filter(p => p._id !== id));
    toast.success("Post deleted");
  } catch (err) {
    console.error(err.response?.data || err);
    toast.error("Failed to delete post");
  }
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
<div
  className={"admin-nav-item " + (activeTab === "feedback" ? "active" : "")}
  onClick={() => setActiveTab("feedback")}
>
  Feedback
</div>

<div
  className={"admin-nav-item " + (activeTab === "posts" ? "active" : "")}
  onClick={() => setActiveTab("posts")}
>
  Posts
</div>

<div
  className={"admin-nav-item " + (activeTab === "orders" ? "active" : "")}
  onClick={() => setActiveTab("orders")}
>
  Orders
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
    <VendorForm
      vendorForm={vendorForm}
      setVendorForm={setVendorForm}
      CITIES={CITIES}
      onSave={handleSaveVendor}
    />

    <VendorList
      vendors={vendors}
      onEdit={handleEditVendor}
      onDelete={handleDeleteVendor}
    />
  </>
)}

       {activeTab === "products" && (
  <>
    <ProductForm
      productForm={productForm}
      setProductForm={setProductForm}
      vendors={vendors}
      onSave={handleSaveProduct}
      onUploadImage={uploadProductImage}
    />

    <ProductList
      products={products}
      onEdit={handleEditProduct}
      onDelete={handleDeleteProduct}
    />
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
{activeTab === "feedback" && (
  <section className="admin-card">
    <h3>User Feedback</h3>

    <table className="admin-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>User</th>
          <th>Message</th>
          <th>Source</th>
            <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {feedbacks.length === 0 ? (
          <tr>
            <td colSpan="4">No feedback yet</td>
          </tr>
        ) : (
          feedbacks.map((f) => (
            <tr key={f._id}>
  <td>{new Date(f.createdAt).toLocaleString()}</td>
  <td>
    {f.user
      ? `${f.user.name} (${f.user.email})`
      : "Anonymous"}
  </td>
  <td style={{ maxWidth: "400px" }}>{f.message}</td>
  <td>{f.source}</td>
  <td>
    <button
      className="admin-secondary-btn"
      onClick={() => handleDeleteFeedback(f._id)}
    >
      Delete
    </button>
  </td>
</tr>

          ))
        )}
      </tbody>
    </table>
    
  </section>
)}

{activeTab === "posts" && (
  <section className="admin-card">
    <h3>All Posts</h3>

    <table className="admin-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>User</th>
          <th>Type</th>
          <th>Content</th>
          <th>Action</th>
          <th>Status</th>

        </tr>
      </thead>

      <tbody>
        {posts.length === 0 ? (
          <tr>
            <td colSpan="5">No posts yet</td>
          </tr>
        ) : (
          posts.map(p => (
            <tr key={p._id}>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
              <td>{p.user?.name || "Unknown"}</td>
              <td>{p.postType}</td>
              <td style={{ maxWidth: "400px" }}>
                {p.text || p.title || "-"}
              </td>
              <td>
  {p.reported ? (
    <span style={{ color: "red", fontWeight: "600" }}>
      🚩 Reported
    </span>
  ) : (
    "OK"
  )}
</td>

              <td>
                <button
                  className="admin-secondary-btn"
                  onClick={() => handleDeletePost(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </section>
)}

{activeTab === "orders" && (
  <section className="admin-card">
    <h3>All Orders</h3>

    <table className="admin-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Customer</th>
          <th>Vendor</th>
          <th>Total</th>
          <th>Status</th>
          <th>Invoice</th>
        </tr>
      </thead>

      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td colSpan="6">No orders yet</td>
          </tr>
        ) : (
          orders.map(order => (
            <tr key={order._id}>
              <td>
                {new Date(order.createdAt).toLocaleString()}
              </td>

              <td>
                <strong>{order.customer.name}</strong><br />
                {order.customer.phone}
              </td>

              <td>
                {order.vendor.name}<br />
                {order.vendor.phone}
              </td>

              <td>₹{order.total}</td>

              <td>
                <span style={{ fontWeight: 600 }}>
                  {order.status}
                </span>
              </td>

              <td>
                <a
                  href={order.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </td>
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