"use client";

import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Trash2 } from "lucide-react";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <Button
        variant={task.is_done ? "default" : "outline"}
        size="icon"
        onClick={() => onToggle(task.id)}
        className="shrink-0"
      >
        <Check className="h-4 w-4" />
      </Button>

      <span
        className={`flex-1 ${
          task.is_done ? "line-through text-muted-foreground" : ""
        }`}
      >
        {task.title}
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        className="shrink-0 text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Card>
  );
}
