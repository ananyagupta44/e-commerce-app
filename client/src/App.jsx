import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductsPage";
import Navbar from "./components/Navbar";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Footer from "./components/Footer";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProtectedRoute from "./route/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./route/AdminRoute";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import ScrollToTop from "./components/ScrollToTop";
import AdminAIPage from "./pages/AdminAIPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shipping"
          element={
            <ProtectedRoute>
              <ShippingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/placeorder"
          element={
            <ProtectedRoute>
              <PlaceOrderPage />
            </ProtectedRoute>
          }
        />

        <Route path="/success/:id" element={<OrderSuccessPage />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/myorders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProductsPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrdersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />
        <Route path="/admin/ai" element={<AdminAIPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
