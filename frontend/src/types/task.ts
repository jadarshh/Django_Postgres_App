export interface Task {
  id: number;
  title: string;
  is_done: boolean;
  created_at: string;
}

export type TaskFilter = "all" | "active" | "completed";
