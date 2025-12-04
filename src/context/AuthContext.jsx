import { createContext, useState, useEffect, useContext } from "react";
import API from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });

      const token = res.data?.token;
      const userData = res.data?.user;

      if (!token || !userData) {
        return { success: false, message: "Invalid backend response format." };
      }

      // Save to localStorage (support both token names for compatibility)
      localStorage.setItem("token", token);
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Login failed. Please check your credentials.",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Registration failed.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
