from django.db import models
from tasks.models import Tasks
from accounts.models import Users


class Notifications(models.Model):
    user = models.ForeignKey(
        Users, on_delete=models.CASCADE, related_name="notifications")
    created_by = models.ForeignKey(
        Users, on_delete=models.CASCADE, related_name="created_notifications")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    task = models.ForeignKey(
        Tasks, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"Notification for {self.user.name}: {self.message} (Created by {self.created_by.name})"
