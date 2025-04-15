from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.mail import send_mail
from django.conf import settings
from .models import Notifications
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from celery import shared_task
from accounts.models import Users
from tasks.models import Tasks
import logging
logger = logging.getLogger(__name__)

# Task to send email when a user account is created


@shared_task
def send_user_created_email(user_id, password):
    user = Users.objects.get(id=user_id)
    role_name = user.role.name if user.role else "No Role"
    subject = "Your User Account Has Been Created"
    html_message = render_to_string("account_creation.html", {
                                    "user": user, "password": password, "role_name": role_name})
    plain_message = strip_tags(html_message)
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = [user.email]

    try:
        logger.info(f"Sending email to {to_email}")
        send_mail(subject, plain_message, from_email,
                  to_email, html_message=html_message)
        logger.info("Email sent successfully")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        logger.error(f"Failed to send email: {str(e)}")


@shared_task
def send_task_assigned_email(user_id, task_id):
    user = Users.objects.get(id=user_id)
    task = Tasks.objects.get(id=task_id)
    role_name = user.role.name if user.role else "No Role"
    subject = f"New Task Assigned"
    html_message = render_to_string(
        "task_assigned.html", {"user": user, "task": task, "role_name": role_name})
    plain_message = strip_tags(html_message)
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = [user.email]

    try:
        send_mail(subject, plain_message, from_email,
                  to_email, html_message=html_message)
    except Exception as e:
        print(f"Failed to send email: {str(e)}")


def save_notification(user, created_by, message, task):
    Notifications.objects.create(
        user=user, created_by=created_by, message=message, task=task)


@shared_task
def send_task_add_notification(user_id, message):
    user = Users.objects.get(id=user_id)
    role_name = user.role.name if user.role else "No Role"
    full_message = f"Role: {role_name} - {message}"
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user.id}",
        {
            "type": "send_notification",
            "message": full_message,
        }
    )


@shared_task
def send_task_status_change_notification(user_id, task_id, new_status):
    user = Users.objects.get(id=user_id)
    task = Tasks.objects.get(id=task_id)
    username = user.name
    task_name = task.title
    role_name = user.role.name if user.role else "No Role"
    status_change_message = f"{username} (Role: {role_name}) assigned task '{task_name}' is {new_status}"
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "admin_group",
        {
            "type": "send_notification",
            "message": status_change_message
        }
    )
