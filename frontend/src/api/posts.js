import api from "./api";

export const fetchPosts = async () => {
  const res = await api.get("/posts");
  return res.data;
};

export const createPost = async (payload) => {
  const res = await api.post("/posts", payload);
  return res.data;
};

export const updatePost = async (id, payload) => {
  const res = await api.put(`/posts/${id}`, payload);
  return res.data;
};

export const deletePost = async (id) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};
