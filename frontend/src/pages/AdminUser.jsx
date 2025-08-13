import React, { useEffect, useState } from "react";
import api from "../api/api";
import Modal from "../components/Modal";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [newRole, setNewRole] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users");
      setUsers(res.data.users || []);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (user) => {
    setSelected(user);
    setNewRole(user.role);
  };

  const submitRole = async () => {
    try {
      await api.put(`/api/users/${selected._id}/role`, { role: newRole });
      await load();
      setSelected(null);
    } catch (e) {
      console.error(e);
      alert("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      await load();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Manage Users</h2>

      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : (
        <>
          {/* Table for desktop */}
          <div className="desktopOnly">
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Full Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Created</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={styles.tr}>
                      <td style={styles.td}>{u.fullName || "-"}</td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>{u.role}</td>
                      <td style={styles.td}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => openEdit(u)}
                          style={{ ...styles.btn, ...styles.btnPrimary }}
                        >
                          Edit Role
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          style={{
                            ...styles.btn,
                            ...styles.btnDanger,
                            marginLeft: 8,
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards for mobile */}
          <div className="mobileOnly">
            {users.map((u) => (
              <div key={u._id} style={styles.card}>
                <p>
                  <strong>Full Name:</strong> {u.fullName || "-"}
                </p>
                <p>
                  <strong>Email:</strong> {u.email}
                </p>
                <p>
                  <strong>Role:</strong> {u.role}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(u.createdAt).toLocaleDateString()}
                </p>
                <div style={{ marginTop: 10, textAlign: "right" }}>
                  <button
                    onClick={() => openEdit(u)}
                    style={{
                      ...styles.btn,
                      ...styles.btnPrimary,
                      marginRight: 8,
                    }}
                  >
                    Edit Role
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    style={{ ...styles.btn, ...styles.btnDanger }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Role Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        <h3 style={{ marginBottom: 15 }}>Edit Role</h3>
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          style={styles.select}
        >
          <option value="admin">admin</option>
          <option value="editor">editor</option>
          <option value="viewer">viewer</option>
        </select>
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <button
            style={{ ...styles.btn, ...styles.btnPrimary }}
            onClick={submitRole}
          >
            Save
          </button>
          <button
            style={{ ...styles.btn, ...styles.btnGhost, marginLeft: 8 }}
            onClick={() => setSelected(null)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Responsive CSS */}
      <style>{`
        .desktopOnly {
          display: block;
        }
        .mobileOnly {
          display: none;
        }
        @media (max-width: 768px) {
          .desktopOnly {
            display: none;
          }
          .mobileOnly {
            display: block;
          }
        }
      `}</style>
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
  title: {
    fontSize: 28,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  loading: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  tableWrapper: {
    overflowX: "auto",
    width: "100%",
    justifyContent: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  },
  th: {
    textAlign: "left",
    padding: "12px 15px",
    color: "#555",
    borderBottom: "2px solid #eaeaea",
    whiteSpace: "nowrap",
  },
  tr: {
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    borderRadius: 8,
  },
  td: {
    padding: "12px 15px",
    verticalAlign: "middle",
    color: "#444",
    whiteSpace: "nowrap",
  },
  card: {
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    color: "#444",
  },
  btn: {
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 14,
    transition: "all 0.25s ease",
    userSelect: "none",
  },
  btnPrimary: {
    backgroundColor: "#4a90e2",
    color: "#fff",
    boxShadow: "0 4px 6px rgba(74,144,226,0.4)",
  },
  btnDanger: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    boxShadow: "0 4px 6px rgba(231,76,60,0.4)",
  },
  btnGhost: {
    backgroundColor: "transparent",
    border: "2px solid #4a90e2",
    color: "#4a90e2",
    fontWeight: "600",
  },
  select: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    outline: "none",
  },
};

export default AdminUsers;
