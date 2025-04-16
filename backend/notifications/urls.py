from django.urls import path
from .views import (
    send_alert_to_user,
    get_notifications,
)

urlpatterns = [
    path('users/send-alert/<int:user_id>/',
         send_alert_to_user, name='send_alert_to_user'),
    path("users/get-notifications/<int:user_id>/",
         get_notifications, name="users-get-notifications"),
]
