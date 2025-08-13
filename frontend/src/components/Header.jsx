import React from "react";
import { useAuth } from "../context/AuthContext";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header
      className="app-header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#4a90e2",
        color: "#fff",
        position: "fixed",
        width: "100%",
        top: 0,
        left: 0,
        zIndex: 999,
        boxSizing: "border-box",
        height: 50,
      }}
    >
      <div>
        {user?.role
          ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Login`
          : "Guest"}
      </div>

      <button
        onClick={toggleSidebar}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: 28,
          cursor: "pointer",
          display: "none",
          lineHeight: 1,
        }}
        className="menu-toggle-btn"
        aria-label="Toggle sidebar menu"
      >
        &#9776;
      </button>

      <style>{`
        @media (max-width: 768px) {
          .menu-toggle-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
