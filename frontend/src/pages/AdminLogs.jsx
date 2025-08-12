import React, { useEffect, useState } from "react";
import api from "../api/api"; // axios instance

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10); // show 10 initially

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

  // group logs in pairs for table rows
  const chunkLogs = (arr, size) => {
    return arr.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);
  };

  const visibleLogs = logs.slice(0, visibleCount);
  const logRows = chunkLogs(visibleLogs, 2);

  return (
    <div className="page">
      <h2>System Logs</h2>
      <div className="card">
        {loading && <div>Loading...</div>}
        {!loading && logs.length === 0 && <div>No logs yet</div>}
        {!loading && logs.length > 0 && (
          <>
            <table className="table">
              <tbody>
                {logRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((log) => (
                      <td
                        key={log._id}
                        style={{
                          border: "1px solid #ccc",
                          padding: "10px",
                          verticalAlign: "top",
                          width: "50%",
                        }}
                      >
                        <div>
                          <strong>
                            {new Date(log.createdAt).toLocaleString()}
                          </strong>
                          {" — "}
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
                      </td>
                    ))}
                    {row.length < 2 && <td style={{ width: "50%" }}></td>}
                  </tr>
                ))}
              </tbody>
            </table>

            {visibleCount < logs.length && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <button
                  className="btn"
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogs;
