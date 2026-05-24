"use client";

import { useState, useEffect } from "react";
import { Task, TaskFilter } from "@/types/task";
import { getTasks, createTask, toggleTask, deleteTask } from "@/lib/api";
import { TaskForm } from "@/components/task-form";
import { TaskItem } from "@/components/task-item";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (title: string) => {
    try {
      const newTask = await createTask(title);
      setTasks([newTask, ...tasks]);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const updated = await toggleTask(id);
      setTasks(tasks.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.is_done;
    if (filter === "completed") return task.is_done;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.is_done).length,
    completed: tasks.filter((t) => t.is_done).length,
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <main className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Task Manager</CardTitle>
          <p className="text-muted-foreground">
            {stats.active} active • {stats.completed} completed • {stats.total}{" "}
            total
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <TaskForm onSubmit={handleCreate} />

          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as TaskFilter)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({stats.completed})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="space-y-2 mt-4">
              {filteredTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tasks found
                </p>
              ) : (
                filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
