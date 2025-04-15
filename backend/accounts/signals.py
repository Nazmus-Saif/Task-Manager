from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Roles, Users


@receiver(post_migrate)
def create_initial_role_and_superuser(sender, **kwargs):
    if sender.name == "accounts":
        role, created = Roles.objects.get_or_create(
            name='super_admin',
            defaults={
                "permissions": {
                    "get_roles": True,
                    "get_tasks": True,
                    "get_users": True,
                    "create_role": True,
                    "create_task": True,
                    "create_user": True,
                    "delete_role": True,
                    "delete_task": True,
                    "delete_user": True,
                    "update_role": True,
                    "update_task": True,
                    "update_user": True
                }
            }
        )

        if not Users.objects.filter(email="superadmin@gmail.com").exists():
            Users.objects.create_superuser(
                email="superadmin@gmail.com",
                name="Nazmus Saif",
                password="superadmin",
                role=role
            )
