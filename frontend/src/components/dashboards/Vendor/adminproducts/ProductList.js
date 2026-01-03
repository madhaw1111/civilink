// src/components/dashboards/Vendor/adminproducts/ProductList.js
import React, { useState } from "react";


export default function ProductList({
  products,
  onEdit,
  onDelete
}) {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(p => {
  const searchText = search.toLowerCase();

  return (
    p.name?.toLowerCase().includes(searchText) ||
    p.productCode?.toLowerCase().includes(searchText) ||
    p.vendorProductCode?.toLowerCase().includes(searchText)
  );
});

  return (
    <section className="admin-card">
      <h3>Products</h3>
       {/* 🔍 SEARCH */}
  <input
    placeholder="Search product / product ID / vendor product ID"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{ marginBottom: 12, width: "100%" }}
  />

      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Product ID</th>
            <th>Vendor</th>
            <th>Vendor Product ID</th>
            <th>City</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="9">No products yet.</td>
            </tr>
          ) : (
            filteredProducts.map((p) => (
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
                <td>{p.productCode}</td>
                <td>{p.vendor?.name}</td>
                <td>{p.vendorProductCode}</td>
                <td>{p.city}</td>
                <td>{p.category}</td>
                <td>
  {p.productType === "RENTAL"
    ? "Rental"
    : `₹${p.price}`}
</td>

                <td>₹{p.price}</td>
                <td>
                  <button
                    className="admin-secondary-btn"
                    onClick={() => onEdit(p)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="admin-secondary-btn"
                    onClick={() => onDelete(p._id)}
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
  );
}
