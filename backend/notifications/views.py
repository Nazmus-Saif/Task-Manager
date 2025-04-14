from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from .serializers import NotificationSerializer
from .models import Notifications
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes


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
