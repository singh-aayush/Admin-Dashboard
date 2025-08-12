import React, { useEffect, useState } from "react";
import api from "../api/api"; // axios instance with baseURL

const EditorContent = () => {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

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

  // Start editing a post
  const startEdit = (p) => {
    setEditing(p);
    setTitle(p.title);
    setContent(p.content);
  };

  // Clear form
  const clear = () => {
    setEditing(null);
    setTitle("");
    setContent("");
  };

  // Create or update a post
  const submit = async () => {
    try {
      if (!title.trim() || !content.trim()) {
        alert("Please fill all fields");
        return;
      }

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

  // Delete post
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
    <div className="page">
      <h2>Manage Content (Editor)</h2>

      {/* Post form */}
      <div className="card">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div>
          <button className="btn" onClick={submit}>
            {editing ? "Update" : "Create"}
          </button>
          {editing && (
            <button className="btn ghost" onClick={clear}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Post list */}
      <div>
        <h3>All Posts</h3>
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          <ul>
            {posts.map((p) => (
              <li key={p._id} className="card small">
                <h4>{p.title}</h4>
                <p>{p.content?.slice(0, 160)}...</p>
                <small>
                  By {p.author?.fullName} on{" "}
                  {new Date(p.createdAt).toLocaleString()}
                </small>
                <div>
                  <button onClick={() => startEdit(p)} className="btn-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p._id)}
                    className="btn-sm danger"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EditorContent;
