import React, { useEffect, useState } from "react";
import api from "../api/api";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/history");
      setLogs(res.data.logs || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load system logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chunkLogs = (arr, size) => {
    return arr.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);
  };

  const visibleLogs = logs.slice(0, visibleCount);
  const logRows = chunkLogs(visibleLogs, 2);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>System Logs</h2>

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : logs.length === 0 ? (
        <div style={styles.noLogs}>No logs yet</div>
      ) : (
        <>
          {/* Desktop Table */}
          {!isMobile && (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <tbody>
                  {logRows.map((row, rowIndex) => (
                    <tr key={rowIndex} style={styles.tr}>
                      {row.map((log) => (
                        <td key={log._id} style={styles.td}>
                          <div style={styles.logDate}>
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                          <div>
                            <strong>Action:</strong>{" "}
                            {log.action.replace(".", " ")}
                          </div>
                          <div>
                            <strong>Actor:</strong> {log.actor.fullName} (
                            {log.actor.email}, role: {log.actor.role})
                          </div>
                          <div>
                            <strong>Details:</strong> {log.details}
                          </div>
                        </td>
                      ))}
                      {row.length < 2 && <td style={styles.td}></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile / Tablet Cards */}
          {isMobile && (
            <div style={styles.cardsWrapper}>
              {visibleLogs.map((log) => (
                <div key={log._id} style={styles.card}>
                  <div style={styles.logDate}>
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                  <p>
                    <strong>Action:</strong> {log.action.replace(".", " ")}
                  </p>
                  <p>
                    <strong>Actor:</strong> {log.actor.fullName} (
                    {log.actor.email}, role: {log.actor.role})
                  </p>
                  <p>
                    <strong>Details:</strong> {log.details}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < logs.length && (
            <div style={styles.loadMoreWrapper}>
              <button
                style={styles.loadMoreBtn}
                onClick={() => setVisibleCount((prev) => prev + 10)}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 8,
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    minHeight: "calc(100vh - 50px)",
    boxSizing: "border-box",
  },
  title: { fontSize: 28, color: "#333", marginBottom: 20, textAlign: "center" },
  loading: { fontSize: 18, color: "#666", textAlign: "center" },
  noLogs: { fontSize: 16, color: "#999", textAlign: "center" },
  tableWrapper: {
    overflowX: "auto",
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  table: {
    minWidth: 600,
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  },
  tr: {
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    borderRadius: 8,
  },
  td: {
    padding: "12px 15px",
    verticalAlign: "top",
    color: "#444",
    borderBottom: "1px solid #eee",
    width: "50%",
  },
  logDate: { fontWeight: 600, marginBottom: 6, color: "#4a90e2" },
  cardsWrapper: { display: "flex", flexDirection: "column", gap: 15 },
  card: {
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    borderRadius: 8,
    padding: 15,
    color: "#444",
  },
  loadMoreWrapper: { textAlign: "center", marginTop: 15 },
  loadMoreBtn: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#4a90e2",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(74,144,226,0.4)",
    transition: "all 0.25s ease",
  },
};

export default AdminLogs;
