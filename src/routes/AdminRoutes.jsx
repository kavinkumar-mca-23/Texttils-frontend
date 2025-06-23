// src/routes/AdminRoutes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default AdminRoute;
