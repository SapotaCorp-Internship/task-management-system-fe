export interface StatItem {
  label: string;
  value: number | string;
  color: string;
}

export type TaskStatus = "To Do" | "In Progress" | "Completed";
export type TaskPriority = "HIGH" | "MEDIUM" | "CRITICAL";

export interface TaskItem {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  progress: number;
}