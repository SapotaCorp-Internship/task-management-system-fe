import { getTaskHistory } from "./../services/taskApi";
import { useEffect, useCallback } from "react";
import { message } from "antd";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
} from "../services/taskApi";
import { useTaskStore } from "../stores/taskStore";

export interface TaskItem {
  key: string;
  title: string;
  description: string;
  status: "Completed" | "In Progress" | "To Do";
  rawStatus: "TODO" | "DOING" | "DONE";
  priority: string;
  category: string;
  categoryId: number | undefined;
  dueDate: string;
  deadline: string | undefined;
  progress: number;
}

export default function useTasks() {
  const { tasks, loading, actionLoading, setTasks, setLoading, setActionLoading } = useTaskStore();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTasks();
      const rawTasks = res.data?.data?.tasks || [];

      const mapped: TaskItem[] = rawTasks.map((t: any) => {
        let normalizedStatus: "Completed" | "In Progress" | "To Do" = "To Do";
        if (t.status === "DONE") normalizedStatus = "Completed";
        else if (t.status === "DOING") normalizedStatus = "In Progress";
        else if (t.status === "TODO") normalizedStatus = "To Do";

        const formattedDate = t.deadline
          ? new Date(t.deadline)
              .toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(",", " -")
          : "No date";

        return {
          key: t.id.toString(),
          title: t.title,
          description: t.description || "",
          status: normalizedStatus,
          rawStatus: t.status,
          priority: t.priority,
          category: t.category?.name || "N/A",
          categoryId: t.categoryId,
          dueDate: formattedDate,
          deadline: t.deadline,
          progress:
            normalizedStatus === "Completed"
              ? 100
              : normalizedStatus === "In Progress"
                ? 50
                : 0,
        };
      });

      setTasks(mapped);
    } catch (error) {
      console.error("❌ [useTasks] Error to fetch:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateTask = async (values: any) => {
    setActionLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        status:
          values.status === "Completed"
            ? "DONE"
            : values.status === "In Progress"
              ? "DOING"
              : "TODO",
        priority: values.priority,
        categoryId: values.categoryId ? Number(values.categoryId) : undefined,
        deadline: values.deadline ? values.deadline.toISOString() : undefined,
      };

      const res = await createTask(payload as any);
      message.success("Created task successfully!");
      await fetchTasks();
      return res.data;
    } catch (error: any) {
      message.error("Failed to create task");
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTask = async (id: string, data: Partial<Task>) => {
    setActionLoading(id);
    try {
      await updateTask(id, data);
      message.success("Updated task successfully");
      await fetchTasks();
    } catch {
      message.error("Failed to update task");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      message.success("Deleted task successfully");
      await fetchTasks();
    } catch (error) {
      console.error("❌ [useTasks] Delete error:", error);
      message.error("Failed to delete task");
    }
  };

  const getTaskHistoryById = async (id: string) => {
    try {
      const res = await getTaskHistory(id);
      return res.data;
    } catch (error) {
      message.error("Failed to fetch task history");
      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    actionLoading,
    fetchTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    getTaskHistoryById,
  };
}