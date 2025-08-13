import React, { useEffect, useState } from "react";
import api from "../api/api"; // axios instance that adds token automatically

const ViewerContent = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Load all posts
  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/posts");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Create new post
  const submitPost = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to post.");

      // Viewer always posts as published
      await api.post(
        "/api/posts",
        { title, content, published: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setContent("");
      await loadPosts();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to create post. Make sure you are logged in."
      );
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Public Content</h2>

      {/* Post creation form */}
      <div style={styles.card}>
        <input
          style={styles.input}
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          style={styles.textarea}
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <button
            style={{ ...styles.btn, ...styles.btnPrimary }}
            onClick={submitPost}
          >
            Create Post
          </button>
        </div>
      </div>

      {/* Posts list */}
      {loading ? (
        <p style={styles.loading}>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p style={styles.noPosts}>No posts found</p>
      ) : (
        <div style={isMobile ? styles.cardsWrapper : styles.gridDesktop}>
          {posts.map((p) => (
            <div key={p._id} style={styles.cardSmall}>
              <h3>{p.title}</h3>
              <p>{p.content?.slice(0, 250)}...</p>
              <small>
                By {p.author?.fullName || "Unknown"} on{" "}
                {new Date(p.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
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
    minHeight: "calc(100vh - 50px)",
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
  gridDesktop: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  },
  cardsWrapper: { display: "flex", flexDirection: "column", gap: 15 },
  loading: { textAlign: "center", color: "#666" },
  noPosts: { textAlign: "center", color: "#999" },
};

export default ViewerContent;
