import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const reminderApi = {
  schedule: async (taskId: number, userId: number, deadline: string | Date | null) => {
    const response = await api.post(`${API_URL}/schedule`, {
      taskId,
      userId,
      deadline,
    });
    return response.data;
  },

  delete: async (taskId: number) => {
    const response = await api.delete(`${API_URL}/${taskId}`);
    return response.data;
  },
};