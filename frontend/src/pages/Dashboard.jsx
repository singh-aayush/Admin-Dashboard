import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    deletedPosts: 0,
    adminData: null,
  });

  // Fetch stats only for admin
  useEffect(() => {
    if (user?.role === "admin") {
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
      fetchStats();
    }
  }, [user?.role]);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Dashboard</h1>
      <p>
        Role: <strong>{user?.role}</strong>
      </p>

      {/* Admin view */}
      {user?.role === "admin" && (
        <>
          <div style={styles.statsGrid}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              color="#2D9CDB"
            />
            <StatCard
              title="Total Posts"
              value={stats.totalPosts}
              color="#27AE60"
            />
            <StatCard
              title="Deleted Posts"
              value={stats.deletedPosts}
              color="#F2994A"
            />
            <StatCard
              title="Logged In Admin"
              value={stats.adminData?.fullName || "Loading..."}
              subValue={stats.adminData?.email}
              color="#9B51E0"
            />
          </div>
          <AdminRecentActivity />
        </>
      )}

      {/* Editor / Viewer view */}
      {(user?.role === "editor" || user?.role === "viewer") && (
        <div style={styles.buttonsWrapper}>
          {user?.role === "editor" && (
            <button
              style={{ ...styles.btn, ...styles.btnPrimary }}
              onClick={() => navigate("/editor")}
            >
              Editor Content
            </button>
          )}
          <button
            style={{ ...styles.btn, ...styles.btnPrimary }}
            onClick={() => navigate("/viewer")}
          >
            Viewer Content
          </button>
        </div>
      )}
    </div>
  );
};

// Admin recent activity component
const AdminRecentActivity = () => {
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/api/history");
        setLogs(res.data.logs || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load recent activity");
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchLogs();
  }, []);

  if (loadingLogs) return <p>Loading activity...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (logs.length === 0) return <p>No recent activity</p>;

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Recent Activity</h2>
      <ul style={styles.activityList}>
        {logs.slice(0, 5).map((log) => (
          <li key={log._id} style={styles.activityItem}>
            <span>{log.actor?.fullName || "Unknown"} — </span>
            <strong>{log.action.replace(".", " ")}</strong>
            <br />
            <small>{new Date(log.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
      {logs.length > 5 && (
        <button
          style={styles.viewMoreBtn}
          onClick={() => window.location.assign("/admin/logs")}
        >
          View More
        </button>
      )}
    </div>
  );
};

const StatCard = ({ title, value, subValue, color }) => (
  <div style={{ ...styles.card, borderColor: color }}>
    <h3 style={{ color }}>{title}</h3>
    <p style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>{value}</p>
    {subValue && <small>{subValue}</small>}
  </div>
);

const styles = {
  page: {
    width: "100%",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "calc(100vh - 50px)",
    padding: 30,
  },
  title: { marginBottom: 20 },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
  },
  card: {
    border: "2px solid",
    borderRadius: 8,
    padding: 20,
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  activityList: { listStyle: "none", padding: 0 },
  activityItem: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 12,
    borderRadius: 6,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    wordBreak: "break-word",
  },
  viewMoreBtn: {
    marginTop: 10,
    backgroundColor: "#4a90e2",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonsWrapper: {
    display: "flex",
    gap: 15,
    flexWrap: "wrap",
    marginTop: 50,
    justifyContent: "center",
  },
  btn: {
    padding: "12px 24px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16,
    transition: "all 0.25s ease",
  },
  btnPrimary: {
    backgroundColor: "#4a90e2",
    color: "#fff",
    boxShadow: "0 4px 6px rgba(74,144,226,0.4)",
  },
};

export default Dashboard;
