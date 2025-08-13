import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const HEADER_HEIGHT = 50; // px
const SIDEBAR_WIDTH = 250; // px

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        style={{
          marginTop: HEADER_HEIGHT,
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
          padding: 20,
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
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
            top: ${HEADER_HEIGHT}px !important;  /* below header */
            left: -${SIDEBAR_WIDTH}px !important;
            width: ${SIDEBAR_WIDTH}px !important;
            height: calc(100vh - ${HEADER_HEIGHT}px) !important;
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
            top: ${HEADER_HEIGHT}px !important; /* below header */
            left: 0 !important;
            width: ${SIDEBAR_WIDTH}px !important;
            height: calc(100vh - ${HEADER_HEIGHT}px) !important;
            box-shadow: none !important;
            z-index: 999;
          }
          main {
            margin-left: ${SIDEBAR_WIDTH}px !important;
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
