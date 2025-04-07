from .models import Users, Tasks
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
            user_data = {
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
            representation.update(user_data)
        return representation


class CreateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = "__all__"
