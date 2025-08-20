import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const header_height = 50; 
const sidebar_width = 250;

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        style={{
          marginTop: header_height,
          marginLeft: sidebarOpen ? sidebar_width : 0,
          padding: 20,
          minHeight: `calc(100vh - ${header_height}px)`,
          boxSizing: "border-box",
          transition: "margin-left 0.3s ease",
        }}
        onClick={() => {
          if (sidebarOpen) setSidebarOpen(false);
        }}
      >
        {children}
      </main>

      <style>{`
        /* Hamburger visible on small screens */
        @media (max-width: 768px) {
          .menu-toggle-btn {
            display: block !important;
          }
          aside.sidebar {
            position: fixed !important;
            top: ${header_height}px !important;  /* below header */
            left: -${sidebar_width}px !important;
            width: ${sidebar_width}px !important;
            height: calc(100vh - ${header_height}px) !important;
            box-shadow: 2px 0 5px rgba(0,0,0,0.1) !important;
            transition: left 0.3s ease !important;
            z-index: 1000 !important;
          }
          aside.sidebar.open {
            left: 0 !important;
          }
          main {
            margin-left: 0 !important;
          }
        }

        /* Sidebar visible on desktop */
        @media (min-width: 769px) {
          aside.sidebar {
            position: fixed !important;
            top: ${header_height}px !important; /* below header */
            left: 0 !important;
            width: ${sidebar_width}px !important;
            height: calc(100vh - ${header_height}px) !important;
            box-shadow: none !important;
            z-index: 999;
          }
          main {
            margin-left: ${sidebar_width}px !important;
          }
          .menu-toggle-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Layout;
