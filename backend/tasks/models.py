import datetime
from django.db import models
from accounts.models import Users


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
