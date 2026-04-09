import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getTasks = () => api.get<Task[]>("/tasks");
export const createTask = (data: { title: string; description?: string; categoryId?: string }) =>
  api.post("/tasks", data);
export const updateTask = (id: string, data: Partial<Task>) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`);
export const getTaskHistory = (id: string) => api.get(`/tasks/${id}/history`);
