import React, { useEffect, useState } from "react";
import api from "../api/api";

const EditorContent = () => {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch all posts
  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/posts");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startEdit = (p) => {
    setEditing(p);
    setTitle(p.title);
    setContent(p.content);
  };

  const clear = () => {
    setEditing(null);
    setTitle("");
    setContent("");
  };

  const submit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill all fields");
      return;
    }
    try {
      if (editing) {
        await api.put(`/api/posts/${editing._id}`, {
          title,
          content,
          published: true,
        });
      } else {
        await api.post("/api/posts", { title, content });
      }
      await load();
      clear();
    } catch (err) {
      console.error(err);
      alert("Failed to save post");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete post?")) return;
    try {
      await api.delete(`/api/posts/${id}`);
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Manage Editor Content</h2>

      {/* Post Form */}
      <div style={styles.card}>
        <input
          style={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          style={styles.textarea}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div style={styles.formActions}>
          <button
            style={{ ...styles.btn, ...styles.btnPrimary }}
            onClick={submit}
          >
            {editing ? "Update" : "Create"}
          </button>
          {editing && (
            <button
              style={{ ...styles.btn, ...styles.btnGhost }}
              onClick={clear}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Posts List */}
      <h3 style={{ marginTop: 30, marginBottom: 15 }}>All Posts</h3>

      {loading ? (
        <p style={styles.loading}>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p style={styles.noPosts}>No posts available</p>
      ) : (
        <>
          {/* Desktop Table */}
          {!isMobile && (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Content</th>
                    <th style={styles.th}>Author</th>
                    <th style={styles.th}>Created</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p._id} style={styles.tr}>
                      <td style={styles.td}>{p.title}</td>
                      <td style={styles.td}>{p.content?.slice(0, 100)}...</td>
                      <td style={styles.td}>{p.author?.fullName}</td>
                      <td style={styles.td}>
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                      <td style={styles.td}>
                        <button
                          style={{ ...styles.btn, ...styles.btnPrimary }}
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          style={{
                            ...styles.btn,
                            ...styles.btnDanger,
                            marginLeft: 8,
                          }}
                          onClick={() => remove(p._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile / Tablet Cards */}
          {isMobile && (
            <div style={styles.cardsWrapper}>
              {posts.map((p) => (
                <div key={p._id} style={styles.cardSmall}>
                  <h4>{p.title}</h4>
                  <p>{p.content?.slice(0, 160)}...</p>
                  <small>
                    By {p.author?.fullName} on{" "}
                    {new Date(p.createdAt).toLocaleString()}
                  </small>
                  <div style={{ marginTop: 10, textAlign: "right" }}>
                    <button
                      style={{
                        ...styles.btn,
                        ...styles.btnPrimary,
                        marginRight: 8,
                      }}
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...styles.btn, ...styles.btnDanger }}
                      onClick={() => remove(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
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
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    marginBottom: 20,
  },
  cardSmall: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 16,
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: 10,
    minHeight: 100,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 16,
    outline: "none",
    resize: "vertical",
  },
  formActions: { marginTop: 15, textAlign: "right" },
  btn: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    transition: "all 0.25s ease",
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
  },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 600 },
  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #eee",
    color: "#555",
  },
  tr: { backgroundColor: "#fff" },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    verticalAlign: "top",
    color: "#444",
  },
  cardsWrapper: { display: "flex", flexDirection: "column" },
  loading: { textAlign: "center", color: "#666" },
  noPosts: { textAlign: "center", color: "#999" },
};

export default EditorContent;
