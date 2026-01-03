// src/components/dashboards/Vendor/adminproducts/ProductList.js
import React from "react";

export default function ProductList({
  products,
  onEdit,
  onDelete
}) {
  return (
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
          {products.length === 0 ? (
            <tr>
              <td colSpan="7">No products yet.</td>
            </tr>
          ) : (
            products.map((p) => (
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
