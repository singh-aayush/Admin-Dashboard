import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Use like:
 * <RoleGuard roles={['admin']}><AdminPage/></RoleGuard>
 */
const RoleGuard = ({ roles, children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const allowed = Array.isArray(roles)
    ? roles.includes(user.role)
    : roles === user.role;
  if (!allowed)
    return (
      <div style={{ padding: 20 }}>
        Unauthorized — you don't have permission to view this page.
      </div>
    );

  return children;
};

export default RoleGuard;
