import React from "react";

import { Navigate, Outlet } from "react-router-dom";
import { LoginCounter } from "../components";

const LoginRoute = ({ children }) => {
  const token = JSON.parse(localStorage.getItem("token-counter"));

  // console.log(token);

  return token?.access_token ? <Navigate to="/admin/home" /> : <LoginCounter />;
};

export default LoginRoute;
