import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          throw new Error("Token expired");
        }

        // Fetch user info from backend
        api
          .get("/api/auth/me")
          .then((res) => {
            setUser(res.data.user);
          })
          .catch(() => {
            localStorage.removeItem("token");
            setUser(null);
          })
          .finally(() => setLoading(false));
      } catch {
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Called on successful login with user info and token
  const setUserFromLogin = (userObj, token) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    setUser({
      id: userObj.id || userObj._id,
      name: userObj.fullName || userObj.username || userObj.name,
      email: userObj.email,
      role: userObj.role || "viewer",
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUserFromLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
