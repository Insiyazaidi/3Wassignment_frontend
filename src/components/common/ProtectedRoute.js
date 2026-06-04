import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

/**
 * ProtectedRoute
 * Wraps routes that require authentication.
 * Shows a spinner while session is being rehydrated.
 * Redirects to /login if not authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While checking auth status — show a centered spinner
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ background: "#F1F5F9" }}
      >
        <CircularProgress color="primary" size={48} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Preserve the intended destination for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
