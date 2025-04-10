from django.urls import re_path
from .consumers import TaskAddNotificationConsumer, StatusUpdateNotificationConsumer

websocket_urlpatterns = [
    re_path(r'ws/notifications/(?P<user_id>\d+)/$',
            TaskAddNotificationConsumer.as_asgi()),

    re_path(r'ws/status_update/(?P<user_id>\d+)/$',
            StatusUpdateNotificationConsumer.as_asgi()),
]
