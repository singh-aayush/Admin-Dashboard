import api from "./api";

export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data; // expect array of users
};

export const updateUserRole = async (id, role) => {
  const res = await api.put(`/users/${id}/role`, { role });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
