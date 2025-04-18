from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("accounts.urls")),
    path("api/", include("tasks.urls")),
    path("api/", include("notifications.urls")),
    path('api/', include('social_django.urls', namespace='social')),
]
