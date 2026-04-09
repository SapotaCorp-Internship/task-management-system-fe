import type { StatItem, TaskItem } from "../types/dashboard";

export const stats: StatItem[] = [
  { label: "Total Tasks", value: 34, color: "blue" },
  { label: "Completed", value: 18, color: "green" },
  { label: "In Progress", value: 12, color: "orange" },
  { label: "Overdue", value: 4, color: "red" },
];

export const tasks: TaskItem[] = [
  { title: "Design homepage", description: "Create wireframe and UI design", status: "In Progress", priority: "HIGH", assignee: "Alice Johnson", dueDate: "2026-04-10", progress: 60 },
  { title: "Setup database", description: "PostgreSQL schema design", status: "Completed", priority: "MEDIUM", assignee: "Bob Smith", dueDate: "2026-04-05", progress: 100 },
  { title: "Implement authentication", description: "JWT login/logout", status: "To Do", priority: "CRITICAL", assignee: "Charlie Brown", dueDate: "2026-04-12", progress: 0 },
];

export const menuItems = [
  { key: "all", label: "All Tasks" },
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];