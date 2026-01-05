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

const SALE_UNITS = [
  "per bag",
  "per kg",
  "per ton",
  "per cubic feet",
  "per piece"
];

const RENTAL_UNITS = ["per day"];

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
        prev.productType === "RENTAL"
          ? { size: "", dailyPrice: "" }
          : { size: "", price: "" }
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

    /* ================= PAYLOAD NORMALIZER ================= */
  const normalizeProductPayload = () => {
    const payload = { ...productForm };

    // Map vendorId → vendor (backend expects `vendor`)
    payload.vendor = payload.vendorId;
    delete payload.vendorId;

    // Normalize variants
    if (payload.variants && payload.variants.length > 0) {
      payload.variants = payload.variants.map((v) => ({
        size: v.size?.trim(),
        price:
          payload.productType === "SALE"
            ? Number(v.price)
            : undefined,
        dailyPrice:
          payload.productType === "RENTAL"
            ? Number(v.dailyPrice)
            : undefined
      }));

      // Remove single-price fields when variants exist
      delete payload.price;
      delete payload.unit;
    } else {
      // No variants → normalize single price
      if (payload.price !== undefined) {
        payload.price = Number(payload.price);
      }
    }

    return payload;
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
              variants: productForm.variants || []
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
              variants: productForm.variants || []
            })
          }
        >
          <option value="SALE">One-time Purchase</option>
          <option value="RENTAL">Rental (per day)</option>
        </select>

        {/* SALE PRICE (simple products) */}
        {productForm.productType === "SALE" &&
          (!productForm.variants || productForm.variants.length === 0) && (
            <input
              type="number"
              placeholder="Price"
              value={productForm.price}
              onChange={(e) =>
                setProductForm({ ...productForm, price: e.target.value })
              }
            />
          )}

        {/* UNIT (CONTROLLED) */}
<select
  value={productForm.unit}
  onChange={(e) =>
    setProductForm({ ...productForm, unit: e.target.value })
  }
>
  <option value="">Select unit</option>

  {productForm.productType === "SALE" &&
    SALE_UNITS.map((u) => (
      <option key={u} value={u}>
        {u}
      </option>
    ))}

  {productForm.productType === "RENTAL" &&
    RENTAL_UNITS.map((u) => (
      <option key={u} value={u}>
        {u}
      </option>
    ))}
</select>


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

        {/* VARIANTS (SALE + RENTAL) */}
        {["SALE", "RENTAL"].includes(productForm.productType) && (
          <div style={{ gridColumn: "1 / -1", marginTop: 16 }}>
            <h4>
              {productForm.productType === "RENTAL"
                ? "Rental Variants (Size / Daily Price)"
                : "Sale Variants (Size / Price)"}
            </h4>

            {(productForm.variants || []).map((v, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr auto",
                  gap: 8,
                  marginBottom: 8
                }}
              >
                <input
                  placeholder="Size (e.g. 20mm / 5 ft)"
                  value={v.size}
                  onChange={(e) =>
                    updateVariant(index, "size", e.target.value)
                  }
                />

                {productForm.productType === "SALE" && (
                  <input
                    type="number"
                    placeholder="Price"
                    value={v.price || ""}
                    onChange={(e) =>
                      updateVariant(index, "price", e.target.value)
                    }
                  />
                )}

                {productForm.productType === "RENTAL" && (
                  <input
                    type="number"
                    placeholder="Daily Price"
                    value={v.dailyPrice || ""}
                    onChange={(e) =>
                      updateVariant(index, "dailyPrice", e.target.value)
                    }
                  />
                )}

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

        {/* IMAGE UPLOAD — ONLY AFTER SAVE */}
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

      <button
  className="admin-primary-btn"
  onClick={() => onSave(normalizeProductPayload())}
>
  {productForm._id ? "Update Product" : "Add Product"}
</button>

    </section>
  );
}
