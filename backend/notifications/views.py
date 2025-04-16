from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from .serializers import NotificationSerializer
from .models import Notifications
from accounts.models import Users
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .utils import send_custom_alert_to_target_user


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_alert_to_user(request, user_id):
    try:
        message = request.data.get("message")
        delivery_type = request.data.get("delivery_type")

        if not all([message, delivery_type]):
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        if delivery_type not in ["email", "in-app", "both"]:
            return Response({"error": "Invalid delivery type."}, status=status.HTTP_400_BAD_REQUEST)

        created_by_user = request.user
        target_user = Users.objects.filter(id=user_id).first()
        if not target_user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        send_custom_alert_to_target_user.delay(
            user_id, created_by_user.id, message, delivery_type
        )
        return Response({"success": "Alert sent successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
