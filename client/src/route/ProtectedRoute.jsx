import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
  );

  // NOT LOGGED IN
  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  // LOGGED IN
  return children;
};

export default ProtectedRoute;
