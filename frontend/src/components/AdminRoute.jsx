import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
const AdminRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) {
    //change the loader from github file
    return <div>Loading...</div>;
  }

  if (!authUser || authUser.role !== "admin") {
    // If the user is not authenticated or not an admin, redirect to the login page
    return <Navigate to="/login" replace />;
  }
  return <Outlet />; // Render the child components if the user is authenticated and an admin
};

export default AdminRoute;
