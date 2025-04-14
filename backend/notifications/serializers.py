from rest_framework import serializers
from .models import Notifications
from tasks.serializers import CreateTaskSerializer


class NotificationSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(
        source='created_by.name', read_only=True)
    task = CreateTaskSerializer(read_only=True)

    class Meta:
        model = Notifications
        fields = "__all__"
