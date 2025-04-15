from rest_framework.permissions import BasePermission


class HasPermission(BasePermission):
    def __init__(self, permission_key):
        self.permission_key = permission_key

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and (
                request.user.is_superuser or
                (request.user.role and request.user.role.permissions.get(
                    self.permission_key, False))
            )
        )
