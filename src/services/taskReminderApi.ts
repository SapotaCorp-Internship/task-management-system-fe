import api from "./api";

export const reminderApi = {
  schedule: async (taskId: number, userId: number, deadline: string | Date | null) => {
    const response = await api.post(`/schedule`, {
      taskId,
      userId,
      deadline,
    });
    return response.data;
  },

  delete: async (taskId: number) => {
    const response = await api.delete(`/${taskId}`);
    return response.data;
  },
};