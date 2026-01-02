import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetailPage from './pages/ProductDetailPage';
import Dashboard from './pages/admin/Dashboard';
import Download from './pages/Download';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './index.css';


import ManageProducts from './pages/admin/ManageProducts';
import ManageMessages from './pages/admin/ManageMessages';
import ProductForm from './pages/admin/ProductForm';

// Load Stripe outside of a component’s render to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  // --- Temporary Debugging ---
  console.log("Clé publique Stripe chargée:", process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  // --- End of Temporary Debugging ---
  
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <Routes>
          {/* Public client-facing routes */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/download/:token" element={<Download />} />
            <Route path="/checkout/:id" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
          </Route>

          {/* Auth route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin-facing routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="messages" element={<ManageMessages />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </Elements>
  );
}

export default App;