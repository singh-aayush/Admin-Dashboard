import React, { useEffect, useState } from "react";
import api from "../api/api";
import Modal from "../components/Modal";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [newRole, setNewRole] = useState("");

  // Fetch all users
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

  // Open modal for role edit
  const openEdit = (user) => {
    setSelected(user);
    setNewRole(user.role);
  };

  // Save role update
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

  // Delete user
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
    <div className="page">
      <h2>Manage Users</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.fullName || "-"}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => openEdit(u)} className="btn-sm">
                    Edit Role
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="btn-sm danger"
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Role Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        <h3>Edit Role</h3>
        <div>
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="admin">admin</option>
            <option value="editor">editor</option>
            <option value="viewer">viewer</option>
          </select>
        </div>
        <div style={{ marginTop: 10 }}>
          <button className="btn" onClick={submitRole}>
            Save
          </button>
          <button
            className="btn ghost"
            onClick={() => setSelected(null)}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
