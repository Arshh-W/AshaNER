import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // TODO: Add authentication protection
    // For now, just render children
    return children;
};

export default ProtectedRoute;