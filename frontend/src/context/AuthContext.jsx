import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id || decoded._id,
          name: decoded.name || decoded.fullName,
          email: decoded.email,
          role: decoded.role || "viewer",
        });
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const setUserFromLogin = (userObj) => {
    setUser({
      id: userObj.id || userObj._id,
      name: userObj.fullName || userObj.username,
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
