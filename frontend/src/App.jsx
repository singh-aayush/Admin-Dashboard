import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";

import ProtectedRoute from "../src/components/ProtectedRoute";
import RoleGuard from "../src/components/RoleGaurd";
import Layout from "../src/components/Layout";

import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import Dashboard from "../src/pages/Dashboard";
import AdminUsers from "../src/pages/AdminUser";
import AdminLogs from "../src/pages/AdminLogs";
import EditorContent from "../src/pages/EditorContent";
import ViewerContent from "../src/pages/ViewerContent";

import "./styles/app.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <RoleGuard roles={["admin"]}>
                  <Layout>
                    <AdminUsers />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute>
                <RoleGuard roles={["admin"]}>
                  <Layout>
                    <AdminLogs />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <RoleGuard roles={["editor", "admin"]}>
                  <Layout>
                    <EditorContent />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/viewer"
            element={
              <ProtectedRoute>
                <Layout>
                  <ViewerContent />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
