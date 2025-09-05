
import api from './axios';
export const fetchSettings = async () => {
  const res = await api.get("/settings");
  return res.data;
};

export const updateSettings = async (data, token) => {
  const res = await api.put("/settings", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
