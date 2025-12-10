import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!role) return navigate("/login");
    if (role === "admin") navigate("/admin");


    if (role === "engineer") navigate("/engineer");
    if (role === "worker") navigate("/worker");
    if (role === "vendor") navigate("/vendor");
    if (role === "customer") navigate("/customer");
  }, [role, navigate]);

  return <div>Redirecting...</div>;
}
