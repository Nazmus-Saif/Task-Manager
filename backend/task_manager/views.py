
from .serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Tasks
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.utils.timezone import now
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CreateTaskSerializer, AddUserSerializer, SignInSerializer, NotificationSerializer
from .models import Tasks, Users, Notifications
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.hashers import check_password, make_password
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.views import APIView
from .utils import send_user_created_email, send_task_assigned_email, save_notification


class TokenRefresh(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if not refresh_token:
                raise ValueError("Refresh token not found in cookies.")

            request.data["refresh"] = refresh_token
            response = super().post(request, *args, **kwargs)
            access_token = response.data.get("access")

            res = Response(
                {"success": True, "message": "Token refreshed successfully."})
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="None",
                max_age=3600 * 24,
            )
            return res
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Failed to refresh token. Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_auth_user(request):
    try:
        user = request.user

        data = {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "permissions": user.permissions,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
        }

        return Response({
            "success": True,
            "message": "User is authenticated.",
            "data": data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "error": f"Error checking authentication status: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([AllowAny])
def sign_in(request):
    try:
        serializer = SignInSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": "Invalid signin credentials.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")

        user = Users.objects.filter(email=email).first()
        if not user:
            return Response({"error": "Invalid email or password."}, status=status.HTTP_404_NOT_FOUND)

        if check_password(password, user.password):
            user.last_login = now()
            user.save(update_fields=["last_login"])

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            data = SignInSerializer(user).data

            res = Response({"message": "Signin successful.",
                           "data": data}, status=status.HTTP_200_OK)
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                samesite="None",
                secure=True,
                max_age=3600 * 24,
            )
            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                samesite="None",
                secure=True,
                max_age=3600 * 24 * 7,
            )

            return res
        else:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({"error": f"Error during sign-in: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sign_out(request):
    try:
        response = Response(
            {"message": "Signed out successfully!"}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response
    except Exception as e:
        return Response({"error": f"Error during sign-out: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_user(request):
    try:
        if not (request.user.is_superuser or request.user.permissions.get("create_user", False)):
            return Response({"error": "You don't have permission to create a user."}, status=status.HTTP_403_FORBIDDEN)

        serializer = AddUserSerializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data["password"]
            user = serializer.save(password=make_password(
                password))
            send_user_created_email(user, password)
            return Response({"message": "User created successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid data.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"Error creating user: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_users(request):
    try:
        if not (request.user.is_superuser or request.user.permissions.get("get_users", False)):
            return Response({"error": "You don't have permission to view users."}, status=status.HTTP_403_FORBIDDEN)

        role = request.query_params.get("role")

        users = Users.objects.filter(role=role).exclude(role="super_admin").order_by(
            "id") if role else Users.objects.exclude(role="super_admin").order_by("id")

        serializer = AddUserSerializer(users, many=True)
        return Response({"message": "Users fetched successfully.", "users": serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Error fetching users: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def edit_user(request, user_id):
    try:
        if not (request.user.is_superuser or request.user.permissions.get("update_user", False)):
            return Response({"error": "You don't have permission to edit this user."}, status=status.HTTP_403_FORBIDDEN)

        user = Users.objects.filter(id=user_id).first()
        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        editable_fields = {"name", "password", "role", "permissions"}
        update_data = {key: value for key,
                       value in request.data.items() if key in editable_fields}

        if not update_data:
            return Response({"error": "You can only update name, password, role, and permissions."}, status=status.HTTP_400_BAD_REQUEST)

        if "password" in update_data:
            update_data["password"] = make_password(update_data["password"])

        if "permissions" in update_data:
            existing_permissions = user.permissions or {}
            existing_permissions.update(
                update_data["permissions"])
            update_data["permissions"] = existing_permissions

        serializer = AddUserSerializer(user, data=update_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated successfully.", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid data.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": f"Error updating user: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    try:
        if not (request.user.is_superuser or request.user.permissions.get("delete_user", False)):
            return Response({"error": "You don't have permission to delete this user."}, status=status.HTTP_403_FORBIDDEN)

        user = Users.objects.filter(id=user_id).first()
        if user:
            user.delete()
            return Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"Error deleting user: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request):
    try:
        if not (request.user.is_superuser or request.user.permissions.get("create_task", False)):
            return Response({"error": "You don't have permission to create a task."}, status=status.HTTP_403_FORBIDDEN)

        assigned_user = Users.objects.filter(
            id=request.data.get("assigned_to")).first()
        if not assigned_user:
            return Response({"error": "Assigned user not found."}, status=status.HTTP_404_NOT_FOUND)

        request.data["assigned_by"] = request.user.id

        serializer = CreateTaskSerializer(data=request.data)
        if serializer.is_valid():
            task = serializer.save()
            send_task_assigned_email(assigned_user, task)

            # Store notification with created_by (admin or person assigning the task)
            save_notification(assigned_user, request.user,
                              f"You have been assigned a new task: {task.title}")

            return Response({"message": "Task created successfully.", "task": serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Invalid task data.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"Error creating task: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notifications(request, user_id):
    try:
        if request.user.id != user_id:
            return Response({"error": "You don't have permission to view notifications for this user."}, status=status.HTTP_403_FORBIDDEN)

        notifications = Notifications.objects.filter(
            user__id=user_id).order_by('-created_at')

        serializer = NotificationSerializer(notifications, many=True)

        return Response({"message": "Notifications retrieved successfully.", "notifications": serializer.data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Error fetching notifications: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tasks(request):
    try:
        if not (request.user.is_superuser or request.user.permissions.get("get_tasks", False)):
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
        if not (request.user.is_superuser or request.user.permissions.get("get_tasks", False)):
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
        if not (request.user.is_superuser or request.user.permissions.get("update_task", False)):
            return Response({"error": "You don't have permission to edit this task."}, status=status.HTTP_403_FORBIDDEN)

        task = Tasks.objects.filter(id=task_id).first()
        if not task:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

        allowed_fields = {"title", "description", "status",
                          "priority", "deadline", "assigned_to", "assigned_by"}
        non_editable_fields = {
            key: value for key, value in request.data.items() if key not in allowed_fields}

        if non_editable_fields:
            field_names = ', '.join(non_editable_fields.keys())
            return Response({"error": f"Fields {field_names} cannot be changed."}, status=status.HTTP_400_BAD_REQUEST)

        if "assigned_to" in request.data:
            assigned_user = Users.objects.filter(
                id=request.data["assigned_to"]).first()
            if not assigned_user:
                return Response({"error": "Assigned user not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreateTaskSerializer(
            task, data=request.data, partial=True)
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
        if not (request.user.is_superuser or request.user.permissions.get("delete_task", False)):
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
            if not (request.user.is_superuser or request.user.permissions.get("get_task", False)):
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
            if not (request.user.is_superuser or request.user.permissions.get("get_tasks", False)):
                return Response({"error": "You don't have permission to view task counts."}, status=status.HTTP_403_FORBIDDEN)

            user_tasks = Tasks.objects.filter(assigned_to=user_id)

            total_tasks = user_tasks.count()
            total_completed = user_tasks.filter(status="Complete").count()
            total_pending = user_tasks.filter(status="Pending").count()
            total_in_progress = user_tasks.filter(status="In Progress").count()

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
            if not (request.user.is_superuser or request.user.permissions.get("get_tasks", False)):
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
            if not (request.user.is_superuser or request.user.permissions.get("get_tasks", False)):
                return Response({"error": "You don't have permission to read upcoming deadlines."}, status=status.HTTP_403_FORBIDDEN)

            today = now().date()
            upcoming_tasks = Tasks.objects.filter(deadline__gte=today).order_by('deadline')[
                :10]

            serializer = CreateTaskSerializer(upcoming_tasks, many=True)

            return Response({
                "message": "Top 10 upcoming task deadlines retrieved successfully.",
                "upcomingDeadlines": serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "error": f"An error occurred while fetching upcoming deadlines: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
