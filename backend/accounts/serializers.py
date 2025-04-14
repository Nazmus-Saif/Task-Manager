from .models import Users
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from notifications.utils import send_user_created_email


class UserManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = "__all__"
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        raw_password = validated_data.get("password")
        validated_data["password"] = make_password(raw_password)
        user = Users.objects.create(**validated_data)
        send_user_created_email.delay(user.id, raw_password)
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(
                validated_data['password'])

        if 'permissions' in validated_data:
            existing_permissions = instance.permissions or {}
            existing_permissions.update(validated_data['permissions'])
            validated_data['permissions'] = existing_permissions

        return super().update(instance, validated_data)

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


class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6)
