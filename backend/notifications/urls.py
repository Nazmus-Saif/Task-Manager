from django.urls import path
from .views import (
    get_notifications,
)

urlpatterns = [
    path("users/get-notifications/<int:user_id>/",
         get_notifications, name="users-get-notifications"),
]
