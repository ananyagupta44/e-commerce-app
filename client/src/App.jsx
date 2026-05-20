import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductsPage";
import Navbar from "./components/Navbar";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/products" element={<ProductPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/product/:id" element={<ProductDetailsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
