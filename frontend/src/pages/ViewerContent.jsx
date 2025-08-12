import React, { useEffect, useState } from "react";
import api from "../api/api"; // axios instance

const ViewerContent = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Load all posts
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

  // Create new post
  const submit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in all fields");
      return;
    }
    try {
      await api.post("/api/posts", { title, content });
      setTitle("");
      setContent("");
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="page">
      <h2>Public Content</h2>

      {/* Post creation form */}
      <div className="card">
        <input
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn" onClick={submit}>
          Create Post
        </button>
      </div>

      {/* Posts list */}
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        <div className="grid">
          {posts.map((p) => (
            <div key={p._id} className="card">
              <h3>{p.title}</h3>
              <p>{p.content?.slice(0, 250)}...</p>
              <small>
                By {p.author?.fullName} on{" "}
                {new Date(p.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewerContent;
