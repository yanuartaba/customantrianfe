import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const PetugasRoute = ({ children }) => {
  const token = JSON.parse(localStorage.getItem("token-counter"));

  return token?.access_token ? <Outlet /> : <Navigate to="/login" />;
};

export default PetugasRoute;
