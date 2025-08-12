import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";

import ProtectedRoute from "../src/components/ProtectedRoute";
import RoleGuard from "../src/components/RoleGaurd";
import Sidebar from "../src/components/Sidebar";
import Header from "../src/components/Header";

import Login from "../src/pages/Login";
import Dashboard from "../src/pages/Dashboard";
import AdminUsers from "../src/pages/AdminUser";
import AdminLogs from "../src/pages/AdminLogs";
import EditorContent from "../src/pages/EditorContent";
import ViewerContent from "../src/pages/ViewerContent";

import "./styles/app.css";

function AppShell({ children }) {
  return (
    <div className="app-root">
      <Sidebar />
      <main className="main">
        <Header />
        <div className="main-content">{children}</div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Dashboard />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <RoleGuard roles={["admin"]}>
                  <AppShell>
                    <AdminUsers />
                  </AppShell>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute>
                <RoleGuard roles={["admin"]}>
                  <AppShell>
                    <AdminLogs />
                  </AppShell>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <RoleGuard roles={["editor", "admin"]}>
                  <AppShell>
                    <EditorContent />
                  </AppShell>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/viewer"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ViewerContent />
                </AppShell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
