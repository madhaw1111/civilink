import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate("/dashboard");

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})} /><br />
        <input name="password" type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})} /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
