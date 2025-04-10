import datetime
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UsersManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class Users(AbstractBaseUser):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=50)
    permissions = models.JSONField(default=dict)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UsersManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "password"]

    def __str__(self):
        return self.email


class PasswordResetToken(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_expired(self):
        return timezone.now() > self.created_at + datetime.timedelta(hours=1)


class Tasks(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    assigned_to = models.ForeignKey(
        Users, on_delete=models.CASCADE, related_name="assigned_tasks")
    assigned_by = models.ForeignKey(
        Users, on_delete=models.CASCADE, related_name="created_tasks")
    priority = models.CharField(max_length=50, default="medium")
    status = models.CharField(max_length=50, default="pending")
    deadline = models.DateField(default=datetime.date.today)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Notifications(models.Model):
    user = models.ForeignKey(
        Users, on_delete=models.CASCADE, related_name="notifications")
    created_by = models.ForeignKey(
        Users, on_delete=models.CASCADE, related_name="created_notifications")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.name}: {self.message} (Created by {self.created_by.name})"
