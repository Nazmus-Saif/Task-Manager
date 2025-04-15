from django.urls import path
from .views import (
    CheckAuthUserView,
    TokenRefresh,
    SignInView,
    SignOutView,
    RoleListView,
    RoleCreateView,
    UserManagementView,
    ForgotPasswordView,
    ResetPasswordView,
)

urlpatterns = [
    # Authentication Routes
    path("token/check-auth-user/",
         CheckAuthUserView.as_view(), name="check-auth-user"),
    path("token/refresh-token/",
         TokenRefresh.as_view(), name="token-refresh"),
    path("users/sign-in/", SignInView.as_view(), name="users-sign-in"),
    path("users/sign-out/", SignOutView.as_view(), name="users-sign-out"),

    # User Management Routes
    path('roles/create/', RoleCreateView.as_view(), name='role-create'),
    path('roles/retrieve/', RoleListView.as_view(), name='role-list'),
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
