from .models import Users, Tasks, Notifications
from rest_framework import serializers


class AddUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation.pop('password', None)
        return representation


class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if isinstance(instance, Users):
            data = {
                "id": instance.id,
                "email": instance.email,
                "name": instance.name,
                "role": instance.role,
                "permissions": instance.permissions,
                "is_staff": instance.is_staff,
                "is_superuser": instance.is_superuser,
                "created_at": instance.created_at,
                "updated_at": instance.updated_at,
            }
            representation.update(data)
        return representation


class UserNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'name']


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


class NotificationSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(
        source='created_by.name', read_only=True)

    class Meta:
        model = Notifications
        fields = "__all__"


class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6)
