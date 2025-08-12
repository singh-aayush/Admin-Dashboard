import React from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="app-header">
      <div>Welcome, {user?.name || user?.email || "Guest"}</div>
      <div>
        <button onClick={logout} className="btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
