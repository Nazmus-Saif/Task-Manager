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


@shared_task
def send_user_created_email(user_id, password):
    user = Users.objects.get(id=user_id)
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


@shared_task
def send_task_assigned_email(user_id, task_id):
    user = Users.objects.get(id=user_id)
    task = Tasks.objects.get(id=task_id)
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


def save_notification(user, created_by, message, task):
    Notifications.objects.create(
        user=user, created_by=created_by, message=message, task=task)


@shared_task
def send_task_add_notification(user_id, message):
    user = Users.objects.get(id=user_id)
    full_message = f"{message}"
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
    status_change_message = f"{username} assigned task '{task_name}' is {new_status}"
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "admin_group",
        {
            "type": "send_notification",
            "message": status_change_message
        }
    )


@shared_task
def send_custom_alert_to_target_user(user_id, created_by_id, message, delivery_type):
    user = Users.objects.get(id=user_id)
    created_by = Users.objects.get(id=created_by_id)

    save_notification(user=user, created_by=created_by,
                      message=message, task=None)

    if delivery_type in ["in-app", "both"]:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{user.id}",
            {
                "type": "send_notification",
                "message": message,
            }
        )

    if delivery_type in ["email", "both"]:
        subject = "You've Received a New Alert"
        html_message = render_to_string("alert_notification.html", {
            "user": user,
            "message": message
        })
        plain_message = strip_tags(html_message)
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [user.email]

        try:
            send_mail(subject, plain_message, from_email,
                      to_email, html_message=html_message)
        except Exception as e:
            print(f"Failed to send alert email: {str(e)}")
