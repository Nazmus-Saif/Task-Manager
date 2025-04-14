from django.urls import path
from .views import (
    create_task,
    get_tasks,
    get_user_tasks,
    edit_task,
    delete_task,
    CountView,
    UserTaskCountView,
    StatusCountView,
    UpcomingDeadlinesView,
)

urlpatterns = [
    path("add-task/", create_task, name="create-task"),
    path("get-tasks/", get_tasks, name="get-tasks"),
    path("get-user-tasks/<int:user_id>/",
         get_user_tasks, name="get-user-tasks"),
    path("edit-task/<int:task_id>/", edit_task, name="edit-task"),
    path("delete-task/<int:task_id>/", delete_task, name="delete-task"),
    path("get-counts/", CountView.as_view(), name="get_counts"),
    path("get-user-tasks-counts/<int:user_id>/",
         UserTaskCountView.as_view(), name="get_user_task_counts"),
    path("get-status-counts/", StatusCountView.as_view(), name="get_status_counts"),
    path("get-upcoming-deadlines/", UpcomingDeadlinesView.as_view(),
         name="get-upcoming-deadlines"),
]
