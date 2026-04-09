import { useMemo } from "react";
import useGetTasks from "./useTask";

export default function useGetStats() {
  const { tasks, loading, fetchTasks: refetch } = useGetTasks();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const notStarted = tasks.filter((t) => t.status === "To Do").length;

    return [
      { label: "TOTAL TASKS", value: total, color: "##C0C0C0" },
      { label: "NOT STARTED", value: notStarted, color: "#" },
      { label: "COMPLETED", value: completed, color: "#10B981" },
      { label: "IN PROGRESS", value: inProgress, color: "#F59E0B" },
    ];
  }, [tasks]);

  return { stats, loading, refetch };
}
