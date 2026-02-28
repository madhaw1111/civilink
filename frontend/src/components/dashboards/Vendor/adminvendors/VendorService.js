// src/components/dashboards/Vendor/adminvendors/VendorService.js

import axios from "axios";

export const createVendorApi = (token) => {
  return axios.create({
    baseURL: "/api/admin",
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const loadVendors = async (api, setVendors) => {
  const res = await api.get("/vendors");
  setVendors(res.data);
};

export const saveVendor = async (api, vendorForm) => {
  if (vendorForm._id) {
    return api.put(`/vendors/${vendorForm._id}`, vendorForm);
  }
  return api.post("/vendors", vendorForm);
};

export const deleteVendor = async (api, id) => {
  return api.delete(`/vendors/${id}`);
};
