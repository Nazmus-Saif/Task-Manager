from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from .serializers import CreateTaskSerializer
from accounts.models import Users
from .models import Tasks
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from notifications.utils import (send_task_assigned_email, save_notification,
                                 send_task_add_notification, send_task_status_change_notification)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request):
    try:
        if not (request.user.is_superuser or request.user.role.permissions.get("create_task", False)):
            return Response({"error": "You don't have permission to create a task."}, status=status.HTTP_403_FORBIDDEN)

        assigned_user = Users.objects.filter(
            id=request.data.get("assigned_to")).first()
        if not assigned_user:
            return Response({"error": "Assigned user not found."}, status=status.HTTP_404_NOT_FOUND)

        request.data["assigned_by"] = request.user.id

        serializer = CreateTaskSerializer(data=request.data)
        if serializer.is_valid():
            task = serializer.save()
            send_task_assigned_email.delay(assigned_user.id, task.id)

            save_notification(assigned_user, request.user,
                              f"You have been assigned a new task: {task.title}", task)

            send_task_add_notification(
                assigned_user.id, f"You have been assigned a new task: {task.title}")

            return Response({"message": "Task created successfully.", "task": serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Invalid task data.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"Error creating task: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tasks(request):
    try:
        if not (request.user.is_superuser or request.user.role.permissions.get("get_tasks", False)):
            return Response({"error": "You don't have permission to view tasks."}, status=status.HTTP_403_FORBIDDEN)

        tasks = Tasks.objects.all() if request.user.is_superuser else Tasks.objects.filter(
            assigned_to=request.user.id)

        if not tasks.exists():
            return Response({"error": "No tasks found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreateTaskSerializer(tasks, many=True)
        return Response({"message": "Tasks retrieved successfully.", "tasks": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Error fetching tasks: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_tasks(request, user_id):
    try:
        if not (request.user.is_superuser or request.user.role.permissions.get("get_tasks", False)):
            return Response({"error": "You don't have permission to view tasks."}, status=status.HTTP_403_FORBIDDEN)

        tasks = Tasks.objects.filter(assigned_to=user_id)

        if not tasks.exists():
            return Response({"error": "No tasks found for the specified user."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreateTaskSerializer(tasks, many=True)
        return Response({"message": "Tasks retrieved successfully.", "userTasks": serializer.data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Error fetching tasks: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def edit_task(request, task_id):
    try:
        if not (request.user.is_superuser or request.user.role.permissions.get("update_task", False)):
            return Response({"error": "You don't have permission to edit this task."}, status=status.HTTP_403_FORBIDDEN)

        task = Tasks.objects.filter(id=task_id).first()
        if not task:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

        allowed_fields = {"title", "description", "status",
                          "priority", "deadline", "assigned_to", "assigned_by"}

        updated_task_data = {
            key: value for key, value in request.data.items() if key in allowed_fields
        }

        if "status" in updated_task_data:
            send_task_status_change_notification(
                request.user.id, task.id, updated_task_data["status"])

        serializer = CreateTaskSerializer(
            task, data=updated_task_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Task updated successfully.", "task": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid data for task update.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": f"Error updating task: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_task(request, task_id):
    try:
        if not (request.user.is_superuser or request.user.role.permissions.get("delete_task", False)):
            return Response({"error": "You don't have permission to delete this task."}, status=status.HTTP_403_FORBIDDEN)

        task = Tasks.objects.filter(id=task_id).first()
        if task:
            task.delete()
            return Response({"message": "Task deleted successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"Error deleting task: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CountView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            if not (request.user.is_superuser or request.user.role.permissions.get("get_tasks", False)):
                return Response({"error": "You don't have permission to read this counts."}, status=status.HTTP_403_FORBIDDEN)

            total_roles = Users.objects.values('role').distinct().count()
            total_users = Users.objects.count()
            total_tasks = Tasks.objects.count()

            return Response({
                "message": "Data count retrieved successfully.",
                "counts": [{
                    "total_roles": total_roles,
                    "total_users": total_users,
                    "total_tasks": total_tasks
                }]
            }, status=status.HTTP_200_OK)

        except Exception:
            return Response({
                "error": "An error occurred while counting."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserTaskCountView(APIView):
    def get(self, request, user_id, *args, **kwargs):
        try:
            if not (request.user.is_superuser or request.user.role.permissions.get("get_tasks", False)):
                return Response({"error": "You don't have permission to view task counts."}, status=status.HTTP_403_FORBIDDEN)

            user_tasks = Tasks.objects.filter(assigned_to=user_id)

            total_tasks = user_tasks.count()
            total_completed = user_tasks.filter(status="completed").count()
            total_pending = user_tasks.filter(status="pending").count()
            total_in_progress = user_tasks.filter(status="in-progress").count()

            return Response({
                "message": "User task count retrieved successfully.",
                "userTasksCounts": [{
                    "total_tasks": total_tasks,
                    "total_completed": total_completed,
                    "total_pending": total_pending,
                    "total_in_progress": total_in_progress
                }]
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "error": f"An error occurred while counting tasks: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StatusCountView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            if not (request.user.is_superuser or request.user.role.permissions.get("get_tasks", False)):
                return Response({"error": "You don't have permission to get this counts."}, status=status.HTTP_403_FORBIDDEN)

            pending_count = Tasks.objects.filter(status='pending').count()
            in_progress_count = Tasks.objects.filter(
                status='in-progress').count()
            completed_count = Tasks.objects.filter(status='completed').count()

            return Response({
                "message": "Task status counts retrieved successfully.",
                "statusCounts": {
                    "pending": pending_count,
                    "inProgress": in_progress_count,
                    "completed": completed_count
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "error": f"An error occurred while counting task statuses: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpcomingDeadlinesView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            if not (request.user.is_superuser or request.user.role.permissions.get("get_tasks", False)):
                return Response({"error": "You don't have permission to read upcoming deadlines."}, status=status.HTTP_403_FORBIDDEN)

            today = now().date()
            upcoming_tasks = Tasks.objects.filter(
                deadline__gte=today).order_by('deadline')[:5]

            serializer = CreateTaskSerializer(upcoming_tasks, many=True)

            return Response({
                "message": "Top 10 upcoming task deadlines retrieved successfully.",
                "upcomingDeadlines": serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "error": f"An error occurred while fetching upcoming deadlines: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
