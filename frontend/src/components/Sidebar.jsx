import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <aside
      className={`sidebar${isOpen ? " open" : ""}`}
      style={{
        width: 250,
        background: "#fff",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh", // desktop default full height
        boxSizing: "border-box",
        overflowY: "auto",
        position: "relative", // default for desktop
      }}
    >
      <div>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <NavLink
                to="/"
                onClick={toggleSidebar}
                style={({ isActive }) => ({
                  fontWeight: isActive ? "bold" : "normal",
                  display: "block",
                  padding: "8px 0",
                  color: "#333",
                  textDecoration: "none",
                })}
              >
                Dashboard
              </NavLink>
            </li>
            {user?.role === "admin" && (
              <>
                <li>
                  <NavLink
                    to="/admin/users"
                    onClick={toggleSidebar}
                    style={({ isActive }) => ({
                      fontWeight: isActive ? "bold" : "normal",
                      display: "block",
                      padding: "8px 0",
                      color: "#333",
                      textDecoration: "none",
                    })}
                  >
                    Manage Users
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/logs"
                    onClick={toggleSidebar}
                    style={({ isActive }) => ({
                      fontWeight: isActive ? "bold" : "normal",
                      display: "block",
                      padding: "8px 0",
                      color: "#333",
                      textDecoration: "none",
                    })}
                  >
                    System Logs
                  </NavLink>
                </li>
              </>
            )}
            {(user?.role === "editor" || user?.role === "admin") && (
              <li>
                <NavLink
                  to="/editor"
                  onClick={toggleSidebar}
                  style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "normal",
                    display: "block",
                    padding: "8px 0",
                    color: "#333",
                    textDecoration: "none",
                  })}
                >
                  Editor Content
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="/viewer"
                onClick={toggleSidebar}
                style={({ isActive }) => ({
                  fontWeight: isActive ? "bold" : "normal",
                  display: "block",
                  padding: "8px 0",
                  color: "#333",
                  textDecoration: "none",
                })}
              >
                Viewer Content
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <button
        onClick={() => {
          logout();
          toggleSidebar();
        }}
        style={{
          marginTop: 20,
          padding: "10px 15px",
          backgroundColor: "#e74c3c",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "bold",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        Logout
      </button>

      <style>{`
        @media (max-width: 768px) {
          aside.sidebar {
            position: fixed !important;
            top: 50px !important; /* Below header */
            left: -250px !important;
            height: calc(100vh - 50px) !important; /* Full height minus header */
            box-shadow: 2px 0 5px rgba(0,0,0,0.1) !important;
            transition: left 0.3s ease !important;
            z-index: 1000 !important;
          }
          aside.sidebar.open {
            left: 0 !important;
          }
        }
        @media (min-width: 769px) {
          aside.sidebar {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
