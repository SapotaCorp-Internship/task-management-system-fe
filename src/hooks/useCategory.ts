import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  type Category 
} from "../services/categoryApi";

export default function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      const rawData = res.data;
      let finalArray: Category[] = [];

      if (Array.isArray(rawData)) {
        finalArray = rawData;
      } else if (rawData && typeof rawData === 'object') {
        finalArray = (rawData as any).categories || (rawData as any).data || (rawData as any).data?.categories || [];
      }
      
      setCategories(finalArray);
    } catch (error) {
      console.error("❌ [useCategories] Fetch error:", error);
      setCategories([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateCategory = async (name: string) => {
    setActionLoading(true);
    try {
      await createCategory(name);
      message.success("Added new category");
      await fetchCategories(); 
      
      window.dispatchEvent(new Event("categoryUpdated"));
    } catch (error: any) {
      console.error("❌ [useCategories] Create error:", error);
      message.error("Failed to add category");
      throw error;
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
      window.dispatchEvent(new Event("categoryUpdated"));
    } catch (error) {
      console.error("❌ [useCategories] Update error:", error);
      message.error("Failed to update category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      message.success("Deleted category successfully");
      await fetchCategories();
      window.dispatchEvent(new Event("categoryUpdated"));
    } catch (error) {
      console.error("❌ [useCategories] Delete error:", error);
      message.error("Failed to delete category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    actionLoading,
    refetch: fetchCategories,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory
  };
}