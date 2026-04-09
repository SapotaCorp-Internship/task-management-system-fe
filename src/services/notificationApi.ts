import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface Notification {
    id: number;
    message: string;
    taskId: number;
    createdAt: string;
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const getNotifications = () => api.get<Notification[]>("/notifications");

export const maskAsRead = (id: number) => api.post(`/notifications/${id}/read`);
