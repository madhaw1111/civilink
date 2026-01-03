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
  /* ================= VARIANT HELPERS ================= */

  const addVariant = () => {
    setProductForm(prev => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        { size: "", quantity: "", dailyPrice: "" }
      ]
    }));
  };

  const updateVariant = (index, key, value) => {
    const updated = [...(productForm.variants || [])];
    updated[index][key] = value;
    setProductForm(prev => ({ ...prev, variants: updated }));
  };

  const removeVariant = (index) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  /* ================= RENDER ================= */

  return (
    <section className="admin-card">
      <h3>{productForm._id ? "Edit Product" : "Add Product"}</h3>

      <div className="admin-form">
        {/* PRODUCT NAME */}
        <input
          placeholder="Product name"
          value={productForm.name}
          onChange={(e) =>
            setProductForm({ ...productForm, name: e.target.value })
          }
        />

        {/* CATEGORY */}
        <select
          value={productForm.category}
          onChange={(e) => {
            const category = e.target.value;
            setProductForm({
              ...productForm,
              category,
              productType: category === "rental" ? "RENTAL" : "SALE",
              variants: category === "rental" ? productForm.variants || [] : []
            });
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        {/* PRODUCT TYPE */}
        <select
          value={productForm.productType}
          onChange={(e) =>
            setProductForm({
              ...productForm,
              productType: e.target.value,
              variants:
                e.target.value === "RENTAL"
                  ? productForm.variants || []
                  : []
            })
          }
        >
          <option value="SALE">One-time Purchase</option>
          <option value="RENTAL">Rental (per day)</option>
        </select>

        {/* SALE PRICE */}
        {productForm.productType === "SALE" && (
          <input
            type="number"
            placeholder="Price"
            value={productForm.price}
            onChange={(e) =>
              setProductForm({ ...productForm, price: e.target.value })
            }
          />
        )}

        {/* UNIT */}
        <input
          placeholder="Unit (e.g., per bag)"
          value={productForm.unit}
          onChange={(e) =>
            setProductForm({ ...productForm, unit: e.target.value })
          }
        />

        {/* VENDOR */}
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

        {/* CITY */}
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

        {/* IMAGE PREVIEW */}
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

        {/* RENTAL VARIANTS */}
        {productForm.productType === "RENTAL" && (
          <div style={{ gridColumn: "1 / -1", marginTop: 16 }}>
            <h4>Rental Variants</h4>

            {(productForm.variants || []).map((v, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr auto",
                  gap: 8,
                  marginBottom: 8
                }}
              >
                <input
                  placeholder="Size (e.g. 5 ft)"
                  value={v.size}
                  onChange={(e) =>
                    updateVariant(index, "size", e.target.value)
                  }
                />

                <input
                  type="number"
                  placeholder="Quantity"
                  value={v.quantity}
                  onChange={(e) =>
                    updateVariant(index, "quantity", e.target.value)
                  }
                />

                <input
                  type="number"
                  placeholder="Daily Price"
                  value={v.dailyPrice}
                  onChange={(e) =>
                    updateVariant(index, "dailyPrice", e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                >
                  ❌
                </button>
              </div>
            ))}

            <button
              type="button"
              className="admin-secondary-btn"
              onClick={addVariant}
            >
              + Add Size
            </button>
          </div>
        )}

        {/* IMAGE UPLOAD (ONLY AFTER SAVE) */}
        {productForm._id && (
          <div style={{ gridColumn: "1 / -1", marginTop: 16 }}>
            <label
              style={{
                fontWeight: 600,
                marginBottom: 6,
                display: "block"
              }}
            >
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                onUploadImage(productForm._id, e.target.files[0])
              }
            />
          </div>
        )}
      </div>

      <button className="admin-primary-btn" onClick={onSave}>
        {productForm._id ? "Update Product" : "Add Product"}
      </button>
    </section>
  );
}
