import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("civilink_user"));

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
