import api from "./api";

export const loginRequest = async (email, password) => {
  // adapt to your backend's request shape
  const res = await api.post("/auth/login", { email, password });
  return res.data; // expect { token, user? }
};
