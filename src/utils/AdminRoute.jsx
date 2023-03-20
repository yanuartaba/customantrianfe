import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = JSON.parse(localStorage.getItem("token-counter"));

  // console.log(token);

  return token?.access_token ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
