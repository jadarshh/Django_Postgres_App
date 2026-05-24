from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    @action(detail=True, methods=["post"])
    def toggle(self, request, pk=None):
        """Toggle task completion status"""
        task = self.get_object()
        task.is_done = not task.is_done
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)
