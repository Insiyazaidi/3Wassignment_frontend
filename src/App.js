import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import theme from "./utils/theme";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/layout/Navbar";

/**
 * AppRoutes
 * Defines application routing structure
 * Public routes: /login, /signup
 * Protected routes: / (home feed)
 */
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes — redirect to home if already authenticated */}
        <Route
          path="/login"
          element={
            !loading && isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !loading && isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <SignupPage />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

/**
 * App — root component
 * Wraps everything with theme, auth context, and router
 */
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
