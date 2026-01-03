// src/components/dashboards/Vendor/adminproducts/ProductService.js

export const loadProducts = async (api, setProducts) => {
  const res = await api.get("/products");
  setProducts(res.data);
};

export const saveProduct = async (api, payload) => {
  // ✅ Do NOT rebuild payload here
  // ✅ Backend handles productCode & vendorProductCode

  if (payload._id) {
    return api.put(`/products/${payload._id}`, payload);
  }

  return api.post("/products", payload);
};

export const deleteProduct = async (api, id) => {
  return api.delete(`/products/${id}`);
};
