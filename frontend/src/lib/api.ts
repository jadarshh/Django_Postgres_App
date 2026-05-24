import { Task } from "@/types/task";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/api/tasks/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function createTask(title: string): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, is_done: false }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function toggleTask(id: number): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks/${id}/toggle/`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to toggle task");
  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/tasks/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
}
