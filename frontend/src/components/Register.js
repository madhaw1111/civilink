import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const navigate = useNavigate();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (err) {
      alert("Register failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} /><br />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
        
        <select name="role" onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="engineer">Engineer</option>
          <option value="worker">Worker</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin (dev only)</option> 
        </select><br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
