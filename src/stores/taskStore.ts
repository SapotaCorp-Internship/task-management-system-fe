import { create } from "zustand";
import { type TaskItem } from "../hooks/useTask";

interface TaskStore {
  tasks: TaskItem[];
  loading: boolean;
  actionLoading: string | boolean | null;
  setTasks: (tasks: TaskItem[]) => void;
  setLoading: (loading: boolean) => void;
  setActionLoading: (actionLoading: string | boolean | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,
  actionLoading: null,
  setTasks: (tasks) => set({ tasks }),
  setLoading: (loading) => set({ loading }),
  setActionLoading: (actionLoading) => set({ actionLoading }),
}));