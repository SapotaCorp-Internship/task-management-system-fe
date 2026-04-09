import api from "../services/api";

export async function checkAuth() {
  try {
    const res = await api.get("/auth/me");
    return res.data.user;
  } catch (error) {
    return null;
  }
}