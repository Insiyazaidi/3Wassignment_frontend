import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMeApi } from "../api/services";

const AuthContext = createContext(null);

/**
 * AuthProvider
 * Manages global authentication state.
 * Persists token and user to localStorage for session persistence.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true); // True while rehydrating session

  /**
   * On mount, verify stored token and restore user from API
   */
  useEffect(() => {
    const rehydrateSession = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const data = await getMeApi();
          setUser(data.user);
          setToken(storedToken);
        } catch {
          // Token invalid or expired — clear everything
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    rehydrateSession();
  }, []);

  /**
   * Called after successful login or signup
   * Saves token and user to state and localStorage
   */
  const loginUser = useCallback((tokenValue, userData) => {
    localStorage.setItem("token", tokenValue);
    setToken(tokenValue);
    setUser(userData);
  }, []);

  /**
   * Clear auth state and localStorage (logout)
   */
  const logoutUser = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth hook — access auth context in any component
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
