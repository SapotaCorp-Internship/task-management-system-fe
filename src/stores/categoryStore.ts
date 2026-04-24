import { create } from "zustand";
import { type Category } from "../services/categoryApi";
 
interface CategoryStore {
  categories: Category[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  setCategories: (categories: Category[]) => void;
  setLoading: (loading: boolean) => void;
  setActionLoading: (actionLoading: boolean) => void;
  setError: (error: string | null) => void;
}
 
export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  loading: false,
  actionLoading: false,
  error: null,
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading }),
  setActionLoading: (actionLoading) => set({ actionLoading }),
  setError: (error) => set({ error }),
}));
 