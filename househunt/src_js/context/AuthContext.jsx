import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Show Toast helper
  const showToast = (message, type = "success") => {
    const id =
      Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check storage on startup
  useEffect(() => {
    const storedToken = localStorage.getItem("hh_token");
    const storedUser = localStorage.getItem("hh_user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Clear corrupt storage
        localStorage.removeItem("hh_token");
        localStorage.removeItem("hh_user");
      }
    }
    setLoading(false);
  }, []);

  // Authorized fetch wrapper
  const fetchWithAuth = async (url, options = {}) => {
    const headers = new Headers(options.headers || {});
    const currentToken = token || localStorage.getItem("hh_token");

    if (currentToken) {
      headers.set("Authorization", `Bearer ${currentToken}`);
    }

    if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401 || res.status === 403) {
      // Token expired or invalid
      const data = await res
        .clone()
        .json()
        .catch(() => ({}));
      if (
        data.message &&
        (data.message.includes("expired") || data.message.includes("token"))
      ) {
        logout();
        showToast("Session expired. Please login again.", "info");
      }
    }

    return res;
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Login failed", "error");
        return false;
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("hh_token", data.token);
      localStorage.setItem("hh_user", JSON.stringify(data.user));
      showToast(data.message || "Logged in successfully!", "success");
      return true;
    } catch (err) {
      showToast("Network error during login.", "error");
      return false;
    }
  };

  // Register
  const register = async (data) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        showToast(resData.message || "Registration failed", "error");
        return false;
      }

      setUser(resData.user);
      setToken(resData.token);
      localStorage.setItem("hh_token", resData.token);
      localStorage.setItem("hh_user", JSON.stringify(resData.user));
      showToast(resData.message || "Registration successful!", "success");
      return true;
    } catch (err) {
      showToast("Network error during registration.", "error");
      return false;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("hh_token");
    localStorage.removeItem("hh_user");
    showToast("Logged out successfully.", "info");
  };

  // Update Profile
  const updateProfile = async (data) => {
    try {
      const res = await fetchWithAuth("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        showToast(resData.message || "Profile update failed", "error");
        return false;
      }

      setUser(resData.user);
      localStorage.setItem("hh_user", JSON.stringify(resData.user));
      showToast(resData.message || "Profile updated!", "success");
      return true;
    } catch (err) {
      showToast("Network error updating profile.", "error");
      return false;
    }
  };

  // Change Password
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const res = await fetchWithAuth("/api/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const resData = await res.json();
      if (!res.ok) {
        showToast(resData.message || "Password update failed", "error");
        return false;
      }

      showToast(resData.message || "Password changed successfully!", "success");
      return true;
    } catch (err) {
      showToast("Network error updating password.", "error");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        toasts,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        showToast,
        dismissToast,
        fetchWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
