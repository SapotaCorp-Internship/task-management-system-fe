import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface Category {
  id: string;
  name: string;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getCategories = () => api.get<Category[]>("/categories");
export const createCategory = (name: string) => api.post<Category>("/categories", { name });
export const updateCategory = (id: string, name: string) => api.put(`/categories/${id}`, { name });
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);