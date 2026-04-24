import api from "./api";
export interface Notification {
    id: number;
    message: string;
    taskId: number;
    createdAt: string;
}

export const getNotifications = () => api.get<Notification[]>("/notifications");

export const markAsRead = (id: number) => api.post(`/notifications/${id}/read`);
