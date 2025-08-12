import api from "./api";

export const fetchLogs = async () => {
  const res = await api.get("/logs");
  return res.data; // expect array of logs
};
