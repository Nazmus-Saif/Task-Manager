from django.urls import path
from .views import (
    check_auth_user,
    TokenRefresh,
    sign_in,
    sign_out,
    ForgotPasswordView,
    ResetPasswordView,
    UserManagementView,
)

urlpatterns = [
    # Authentication Routes
    path("token/check-auth-user/", check_auth_user, name="check-auth-user"),
    path("token/refresh-token/",
         TokenRefresh.as_view(), name="token-refresh"),
    path("users/sign-in/", sign_in, name="users-sign-in"),
    path("users/sign-out/", sign_out, name="users-sign-out"),

    # User Management Routes
    path("users/create-retrieve/", UserManagementView.as_view(),
         name="users-create-retrieve"),
    path("users/update-delete/<int:user_id>/",
         UserManagementView.as_view(), name="users-update-delete"),

    # Password Management Routes
    path("users/forgot-password/",
         ForgotPasswordView.as_view(), name="users-forgot-password"),
    path("users/reset-password/<str:token>/",
         ResetPasswordView.as_view(), name="users-reset-password"),
]
