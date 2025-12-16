import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';

  // If authenticated, render the child routes (the AdminLayout).
  // Otherwise, redirect to the login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
