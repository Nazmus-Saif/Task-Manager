from .models import Tasks
from rest_framework import serializers


class CreateTaskSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.SerializerMethodField()
    assigned_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Tasks
        fields = "__all__"

    def get_assigned_to_name(self, obj):
        return obj.assigned_to.name if obj.assigned_to else None

    def get_assigned_by_name(self, obj):
        return obj.assigned_by.name if obj.assigned_by else None
