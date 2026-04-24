import { useEffect } from "react";
import { message } from "antd";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryApi";
import { useCategoryStore } from "../stores/categoryStore";

export default function useCategories() {
  const {
    categories,
    loading,
    actionLoading,
    error,
    setCategories,
    setLoading,
    setActionLoading,
    setError,
  } = useCategoryStore();

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategories();
      const raw = res.data;
      const data = Array.isArray(raw)
        ? raw
        : (raw as any)?.categories ?? (raw as any)?.data?.categories ?? (raw as any)?.data ?? [];
      setCategories(data);
    } catch (error: any) {
      setError(error.message ?? "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (name: string) => {
    setActionLoading(true);
    try {
      await createCategory(name);
      message.success("Added new category");
      await fetchCategories();
    } catch {
      message.error("Failed to add category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    setActionLoading(true);
    try {
      await updateCategory(id, name);
      message.success("Updated category successfully");
      await fetchCategories();
    } catch {
      message.error("Failed to update category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setActionLoading(true);
    try {
      await deleteCategory(id);
      message.success("Deleted category successfully");
      await fetchCategories();
    } catch {
      message.error("Failed to delete category");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    actionLoading,
    error,
    refetch: fetchCategories,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  };
}