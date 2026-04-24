
import api from "./api";
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "DOING" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  deadline?: string;
  completedAt?: string; 
  userId: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    color?: string;
  };
  createdAt: string; 
  updatedAt: string; 
}
type GetTasksResponse = {
  data: {
    tasks: Task[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export const getTasks = () => api.get<GetTasksResponse>("/tasks");
export const createTask = (data: { title: string; description?: string; categoryId?: string }) =>
  api.post("/tasks", data);
export const updateTask = (id: string, data: Partial<Task>) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`);
export const getTaskHistory = (id: string) => api.get(`/tasks/${id}/history`);
