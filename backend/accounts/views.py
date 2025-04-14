from .models import PasswordResetToken
from django.conf import settings
from django.core.mail import send_mail
import uuid
from django.utils.timezone import now
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserManagementSerializer, SignInSerializer, ResetPasswordSerializer
from .models import Users
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.views import APIView
from backend.permission import HasPermission


class TokenRefresh(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if not refresh_token:
                raise ValueError("Refresh token not found in cookies.")

            request.data["refresh"] = refresh_token
            response = super().post(request, *args, **kwargs)
            access_token = response.data.get("access")

            res = Response(
                {"success": True, "message": "Token refreshed successfully."})
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="None",
                max_age=3600 * 24,
            )
            return res
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Failed to refresh token. Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class CheckAuthUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            data = {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role,
                "permissions": user.permissions,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "created_at": user.created_at,
                "updated_at": user.updated_at,
            }

            return Response({
                "success": True,
                "message": "User is authenticated.",
                "data": data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "error": f"Error checking authentication status: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = SignInSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({"error": "Invalid signin credentials.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            email = serializer.validated_data.get("email")
            password = serializer.validated_data.get("password")

            user = Users.objects.filter(email=email).first()
            if not user:
                return Response({"error": "Invalid email or password."}, status=status.HTTP_404_NOT_FOUND)

            if check_password(password, user.password):
                user.last_login = now()
                user.save(update_fields=["last_login"])
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
                data = SignInSerializer(user).data
                res = Response({"message": "Signin successful.",
                                "data": data}, status=status.HTTP_200_OK)
                res.set_cookie(
                    key="access_token",
                    value=access_token,
                    httponly=True,
                    samesite="None",
                    secure=True,
                    max_age=3600 * 24,
                )
                res.set_cookie(
                    key="refresh_token",
                    value=refresh_token,
                    httponly=True,
                    samesite="None",
                    secure=True,
                    max_age=3600 * 24 * 7,
                )

                return res
            else:
                return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": f"Error during sign-in: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SignOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            response = Response(
                {"message": "Signed out successfully!"}, status=status.HTTP_200_OK)
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            return response
        except Exception as e:
            return Response({"error": f"Error during sign-out: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserManagementView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not HasPermission("create_user"):
            return Response({"error": "You don't have permission to create a user."}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserManagementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid data.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        if not HasPermission("get_users"):
            return Response({"error": "You don't have permission to view users."}, status=status.HTTP_403_FORBIDDEN)

        role = request.query_params.get("role")
        users = Users.objects.filter(role=role).exclude(role="super_admin").order_by(
            "id") if role else Users.objects.exclude(role="super_admin").order_by("id")
        serializer = UserManagementSerializer(users, many=True)
        return Response({"message": "Users fetched successfully.", "users": serializer.data}, status=status.HTTP_200_OK)

    def put(self, request, user_id):
        if not HasPermission("update_user"):
            return Response({"error": "You don't have permission to update users."}, status=status.HTTP_403_FORBIDDEN)

        user = Users.objects.filter(id=user_id).first()
        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserManagementSerializer(
            user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated successfully.", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid data.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        if not HasPermission("delete_user"):
            return Response({"error": "You don't have permission to delete users."}, status=status.HTTP_403_FORBIDDEN)

        user = Users.objects.filter(id=user_id).first()
        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            return Response({"error": "Email not found"}, status=status.HTTP_400_BAD_REQUEST)

        token = str(uuid.uuid4())
        PasswordResetToken.objects.create(user=user, token=token)

        reset_link = f"{settings.FRONTEND_URL}/user/reset-password/{token}/"

        send_mail(
            "Password Reset Request",
            f"Click the link to reset your password: {reset_link}",
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        return Response({"message": "Password reset link sent"}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        try:
            reset_token = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        if reset_token.is_expired:
            return Response({"error": "Token has expired"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = reset_token.user
            user.set_password(serializer.validated_data["password"])
            user.save()

            reset_token.delete()

            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
