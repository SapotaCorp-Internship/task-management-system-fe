import api from "./api";

export const getGoogleLoginUrl = () => `${api.defaults.baseURL}/auth/google`;

export const loginWithGoogle = () => {
  window.location.assign(`${api.defaults.baseURL}/auth/google`);
};

export const logout = () => api.post("/auth/logout");