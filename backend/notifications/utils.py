from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.mail import send_mail
from django.conf import settings
from .models import Notifications
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_user_created_email(user, password):
    subject = "Your User Account Has Been Created"

    html_message = render_to_string("account_creation.html", {
                                    "user": user, "password": password})
    plain_message = strip_tags(html_message)

    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = [user.email]

    try:
        send_mail(subject, plain_message, from_email,
                  to_email, html_message=html_message)
    except Exception as e:
        print(f"Failed to send email: {str(e)}")


def send_task_assigned_email(user, task):
    subject = f"New Task Assigned"

    html_message = render_to_string(
        "task_assigned.html", {"user": user, "task": task})
    plain_message = strip_tags(html_message)

    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = [user.email]

    try:
        send_mail(subject, plain_message, from_email,
                  to_email, html_message=html_message)
    except Exception as e:
        print(f"Failed to send email: {str(e)}")


def save_notification(user, created_by, message):
    Notifications.objects.create(
        user=user, created_by=created_by, message=message)


def send_task_add_notification(user_id, message):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user_id}",
        {
            "type": "send_notification",
            "message": message,
        }
    )


def send_task_status_change_notification(user, task, new_status):
    username = user.name
    task_name = task.title
    status_change_message = f"{username} assigned task '{task_name}' is {new_status}"

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "admin_group",
        {
            "type": "send_notification",
            "message": status_change_message
        }
    )
