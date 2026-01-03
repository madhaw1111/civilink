// src/components/dashboards/Vendor/adminproducts/ProductForm.js
import React from "react";

const CITIES = ["Chennai", "Madurai", "Coimbatore", "Karaikudi"];

const CATEGORIES = [
  { id: "raw", label: "Raw Materials" },
  { id: "furniture", label: "Furniture" },
  { id: "electrical", label: "Electrical" },
  { id: "plumbing", label: "Plumbing" },
  { id: "concrete", label: "Ready-Mix Concrete" },
  { id: "rental", label: "Rental Equipment" }
];

export default function ProductForm({
  productForm,
  setProductForm,
  vendors,
  onSave,
  onUploadImage
}) {
  return (
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
          type="number"
          placeholder="Price"
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

        {/* IMAGE */}
        <label>Product Image</label>

        {productForm.imageUrl && (
          <img
            src={productForm.imageUrl}
            alt="product"
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: 8
            }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            onUploadImage(productForm._id, e.target.files[0])
          }
        />
      </div>

      <button className="admin-primary-btn" onClick={onSave}>
        {productForm._id ? "Update Product" : "Add Product"}
      </button>
    </section>
  );
}
