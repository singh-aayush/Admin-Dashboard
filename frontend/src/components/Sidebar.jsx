import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  return (
    <aside className="sidebar">
      <h3 className="brand">Admin Dashboard</h3>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Dashboard</NavLink>
          </li>
          {user?.role === "admin" && (
            <>
              <li>
                <NavLink to="/admin/users">Manage Users</NavLink>
              </li>
              <li>
                <NavLink to="/admin/logs">System Logs</NavLink>
              </li>
            </>
          )}
          {(user?.role === "editor" || user?.role === "admin") && (
            <li>
              <NavLink to="/editor">Content (Editor)</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/viewer">Content (Viewer)</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
