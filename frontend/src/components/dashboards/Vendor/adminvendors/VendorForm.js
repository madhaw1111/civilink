//src/components/dashboards/Vendor/adminvendors/VendorForm.js

import React from "react";

export default function VendorForm({
  vendorForm,
  setVendorForm,
  CITIES,
  onSave
}) {

    
  return (
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

        <input
  placeholder="GST Number"
  value={vendorForm.gstNumber}
  onChange={(e) =>
    setVendorForm({ ...vendorForm, gstNumber: e.target.value.toUpperCase() })
  }
/>

      </div>

      <button className="admin-primary-btn" onClick={onSave}>
        {vendorForm._id ? "Update Vendor" : "Add Vendor"}
      </button>
    </section>
  );
}
