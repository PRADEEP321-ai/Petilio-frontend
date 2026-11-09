import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Shop from "./Components/Shop";
import About from "./Components/About";
import Blog from "./Components/Blog";
import Contact from "./Components/Contact";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Footer from "./Components/Footer";
import Cart from "./Components/Cart";
import ProductDetail from "./Components/ProductDetail";
import Checkout from "./Components/Checkout";
import Profile from "./Components/Profile";
import MyOrders from "./Components/MyOrders";
import ProtectedRoute from "./Components/ProtectedRoute";

// Admin pages
import AdminLayout from "./Components/Admin/AdminLayout";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminProducts from "./Components/Admin/AdminProducts";
import ManageUsers from "./Components/Admin/ManageUsers";
import AdminProfile from "./Components/Admin/AdminProfile";

import "./index.css";
import ProtectedRoutes from "./Components/ProtectedRoutes";

// Main website layout
function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Pages with Navbar and Footer */}
      <Route element={<MainLayout />}>
        {/* Public pages: anyone can open these */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Private pages: login required */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>
      </Route>

      {/* Admin pages without public Navbar and Footer */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Authentication pages without Navbar and Footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;