import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Admin({ theme }) {
  return (
    <>
      <Sidebar theme={theme} />
      <div className="pl-[16rem] w-full h-full overflow-auto">
        <div className="px-6 py-6 justify-start">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Admin;
