from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST

from .forms import TaskForm
from .models import Task


def task_list(request):
    form = TaskForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect("task-list")

    return render(
        request,
        "tasks/task_list.html",
        {
            "form": form,
            "tasks": Task.objects.all(),
            "total_tasks": Task.objects.count(),
            "done_tasks": Task.objects.filter(is_done=True).count(),
        },
    )


@require_POST
def toggle_task(request, pk):
    task = get_object_or_404(Task, pk=pk)
    task.is_done = not task.is_done
    task.save(update_fields=["is_done"])
    return redirect("task-list")
