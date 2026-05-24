from django.urls import path

from . import views


urlpatterns = [
    path("", views.task_list, name="task-list"),
    path("tasks/<int:pk>/toggle/", views.toggle_task, name="toggle-task"),
]
