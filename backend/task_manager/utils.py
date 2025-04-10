from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.mail import send_mail
from django.conf import settings
from .models import Notifications


def send_user_created_email(user, password):
    subject = "Your User Account Has Been Created"
    message = f"""
    Hello {user.name},

    Your user account has been successfully created.

    Here are your login credentials:
    Email: {user.email}
    Password: {password}  (Please do not share this password with anyone else)

    You can log in to your account using the credentials above.

    Best regards,
    The Team
    """
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = [user.email]

    try:
        send_mail(subject, message, from_email, to_email)
    except Exception as e:
        print(f"Failed to send email: {str(e)}")


def send_task_assigned_email(user, task):
    subject = f"New Task Assigned: {task.title}"
    message = f"Hello {user.name},\n\nYou have been assigned a new task: {task.title}.\n\nDescription:\n{task.description}\n\nPriority: {task.priority}\n\nDeadline: {task.deadline}"
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = [user.email]

    try:
        send_mail(subject, message, from_email, to_email)
    except Exception as e:
        print(f"Failed to send email: {str(e)}")


def save_notification(user, created_by, message):
    Notifications.objects.create(
        user=user, created_by=created_by, message=message)


def send_notification(user_id, message):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user_id}",
        {
            "type": "send_notification",
            "message": message,
        }
    )
