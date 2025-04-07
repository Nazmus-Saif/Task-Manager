from django.urls import path
from .views import (
    check_auth_user,
    TokenRefresh,
    sign_in,
    sign_out,
    create_user,
    edit_user,
    create_task,
    get_tasks,
    edit_task,
    delete_task,
)

urlpatterns = [
    path("check-auth-user/", check_auth_user, name="check_auth_user"),
    path("token/refresh/", TokenRefresh.as_view(), name="token_refresh"),
    path("sign-in/", sign_in, name="sign-in"),
    path("sign-out/", sign_out, name="sign_out"),
    path("add-user/", create_user, name="user-create"),
    path("edit-user/<int:user_id>/", edit_user, name="user-edit"),
    path("add-task/", create_task, name="task-create"),
    path("get-tasks/", get_tasks, name="get-tasks"),
    path("edit-task/<int:task_id>/", edit_task, name="edit-task"),
    path("delete-task/<int:task_id>/", delete_task, name="delete-task"),
]
