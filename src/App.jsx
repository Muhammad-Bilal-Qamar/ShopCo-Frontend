// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import PromoBanner from "./My Components/HomePage Components/Promobar.jsx";
import Navbar from "./My Components/HomePage Components/Navbar.jsx";
import Hero from "./My Components/HomePage Components/Hero.jsx";
import ProductCards from "./My Components/HomePage Components/Productscards.jsx";
import TopProducts from "./My Components/HomePage Components/TopProducts.jsx";
import Browse from "./My Components/HomePage Components/Browse.jsx";
import Footer from "./My Components/HomePage Components/Footer.jsx";
import Cart from "./My Components/Product Details Components/Cart.jsx";
import ProductDetail from "./My Components/Product Details Components/ProductDetails.jsx";
import CategoryPage from "./My Components/Category Components/CategoryPage.jsx";
import Login from "./My Components/Authentication/Login.jsx";
import Signup from "./My Components/Authentication/Signup.jsx";
import Profile from "./My Components/Authentication/Profile.jsx";
import ForgotPassword from "./My Components/Authentication/ForgotPassword.jsx";
import ProtectedRoute from "./My Components/Authentication/ProtectedRoute.jsx";
import FloatingChatButton from "./My Components/Chat Components/FloatingChatButton.jsx";
import AdminChatDashboard from "./My Components/Chat Components/AdminChatDashboard.jsx";
import AdminProductsPage from "./My Components/Product Management Components/AdminProductsPage.jsx";

const HomePage = () => {
  return (
    <div>
      <PromoBanner />
      <Navbar />
      <Hero />
      <ProductCards />
      <TopProducts />
      <Browse />
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          exact
          path="/cart"
          element={
            <ProtectedRoute message="You need to log in to view your cart.">
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route exact path="/product/:id" element={<ProductDetail />} />
        <Route
          exact
          path="/category/:categoryName"
          element={<CategoryPage />}
        />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route
          exact
          path="/admin/products"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/admin/dashboard/chats"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminChatDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <FloatingChatButton />
    </>
  );
};

export default App;
