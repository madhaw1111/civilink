// src/components/dashboards/Vendor/adminproducts/ProductService.js
export const loadProducts = async (api, setProducts) => {
  const res = await api.get("/products");
  setProducts(res.data);
};

export const saveProduct = async (api, productForm) => {
  const payload = {
    name: productForm.name,
    category: productForm.category,
    price: Number(productForm.price),
    unit: productForm.unit,
    vendorId: productForm.vendorId,
    city: productForm.city,
    imageUrl: productForm.imageUrl,
    isActive: productForm.isActive
  };

  if (productForm._id) {
    return api.put(`/products/${productForm._id}`, payload);
  }
  return api.post("/products", payload);
};

export const deleteProduct = async (api, id) => {
  return api.delete(`/products/${id}`);
};
