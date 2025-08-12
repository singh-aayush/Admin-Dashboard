import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const Dashboard = () => {
  const { user } = useAuth();

  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    deletedPosts: 0,
    adminData: null,
  });

  const PREVIEW_LIMIT = 5;

  // Fetch quick stats
  const fetchStats = async () => {
    try {
      const [usersRes, postsRes, meRes, logsRes] = await Promise.all([
        api.get("/api/users"),
        api.get("/api/posts"),
        api.get("/api/auth/me"),
        api.get("/api/history"),
      ]);

      const deletedPostsCount = (logsRes.data.logs || []).filter(
        (log) => log.action === "post.delete"
      ).length;

      setStats({
        totalUsers: usersRes.data.users?.length || 0,
        totalPosts: postsRes.data.posts?.length || 0,
        deletedPosts: deletedPostsCount,
        adminData: meRes.data.user || null,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  // Fetch recent activity logs
  const fetchLogs = async () => {
    try {
      const res = await api.get("/api/history");
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("Failed to load recent activity");
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchLogs();
  }, []);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>
        Role: <strong>{user?.role}</strong>
      </p>

      {/* Quick Stats */}
      <div className="grid" style={{ marginBottom: "20px" }}>
        <div className="card">
          <h3>Total Users</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {stats.totalUsers}
          </p>
        </div>
        <div className="card">
          <h3>Total Posts</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {stats.totalPosts}
          </p>
        </div>
        <div className="card">
          <h3>Deleted Posts</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {stats.deletedPosts}
          </p>
        </div>
        <div className="card">
          <h3>Logged In Admin</h3>
          {stats.adminData ? (
            <>
              <p>{stats.adminData.fullName}</p>
              <small>{stats.adminData.email}</small>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid">
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <h3>Recent activity</h3>
          {loadingLogs ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : logs.length === 0 ? (
            <p>No recent activity</p>
          ) : (
            <>
              <ul>
                {logs.slice(0, PREVIEW_LIMIT).map((log) => (
                  <li key={log._id}>
                    <strong>{log.action}</strong> — {log.details}
                    <br />
                    <small>
                      by {log.actor?.fullName} ({log.actor?.email}) on{" "}
                      {new Date(log.createdAt).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
              {logs.length > PREVIEW_LIMIT && (
                <button
                  className="btn"
                  style={{ marginTop: "10px" }}
                  onClick={() => setShowModal(true)}
                >
                  View More
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal for all activity */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2>All Activities</h2>
            <button style={closeBtnStyle} onClick={() => setShowModal(false)}>
              ✖
            </button>
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <ul>
                {logs.map((log) => (
                  <li
                    key={log._id}
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <div>
                      <strong>
                        {new Date(log.createdAt).toLocaleString()}
                      </strong>{" "}
                      —{" "}
                      <span style={{ textTransform: "capitalize" }}>
                        {log.action.replace(".", " ")}
                      </span>
                    </div>
                    <div>
                      <strong>Actor:</strong> {log.actor.fullName} (
                      {log.actor.email}, role: {log.actor.role})
                    </div>
                    <div>
                      <strong>Details:</strong> {log.details}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Modal styles */
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "600px",
  maxWidth: "90%",
  position: "relative",
};

const closeBtnStyle = {
  position: "absolute",
  top: "8px",
  right: "8px",
  background: "transparent",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
};

export default Dashboard;
