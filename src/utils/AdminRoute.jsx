import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = ({ children }) => {
  // const token = JSON.parse(localStorage.getItem("token-counter"));
  const myProfile = JSON.parse(localStorage.getItem("my-profile"));

  // console.log(myProfile);

  // return token?.access_token && myProfile.isAdmin === true ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to="/login" />
  // );
  // return token?.access_token === true ? <Outlet /> : <Navigate to="/login" />;
  return myProfile?.isAdmin === true ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
