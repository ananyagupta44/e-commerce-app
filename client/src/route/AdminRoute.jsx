import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
  );

  if (!userInfo || userInfo.user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
