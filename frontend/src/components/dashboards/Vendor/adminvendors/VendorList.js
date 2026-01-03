// src/components/dashboards/Vendor/adminvendors/VendorList.js

import React, { useState } from "react";

export default function VendorList({
  vendors = [],
  onEdit,
  onDelete
}) {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");
const filteredVendors = vendors.filter((v) => {
  const name = v?.name || "";
  const city = v?.city || "";
  const email = v?.email || "";
  const phone = v?.phone || "";
  const vendorId = v?.vendorCode || "";

  const searchText = search.toLowerCase();

  const matchSearch =
    name.toLowerCase().includes(searchText) ||
    email.toLowerCase().includes(searchText) ||
    phone.includes(searchText) ||
    vendorId.toLowerCase().includes(searchText);

  const matchCity =
    cityFilter === "ALL" || city === cityFilter;

  return matchSearch && matchCity;
});

  return (
    <section className="admin-card">
      <h3>Vendors</h3>

      {/* 🔍 Search + Filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <input
          placeholder="Search vendor name,id,gmail,phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="ALL">All Cities</option>
          <option value="Chennai">Chennai</option>
          <option value="Madurai">Madurai</option>
          <option value="Coimbatore">Coimbatore</option>
          <option value="Karaikudi">Karaikudi</option>
        </select>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Vendor ID</th>
            <th>Name</th>
            <th>City</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredVendors.map((v) => (
            <tr key={v._id}>
              <td>{v.vendorCode || "-"}</td>
              <td>{v.name}</td>
              <td>{v.city}</td>
              <td>{v.phone}</td>
              <td>{v.email}</td>
              <td>
                <button
                  className="admin-secondary-btn"
                  onClick={() => onEdit(v)}
                >
                  Edit
                </button>{" "}
                <button
                  className="admin-secondary-btn"
                  onClick={() => onDelete(v._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredVendors.length === 0 && (
            <tr>
              <td colSpan="6">No vendors found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
