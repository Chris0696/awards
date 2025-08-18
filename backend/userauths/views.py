from django.shortcuts import render

from userauths.utils import send_otp_email
from .models import User
from userauths import serializers as api_serializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework import generics, status

from django.contrib.auth.hashers import check_password
from rest_framework.response import Response



class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = api_serializer.MyTokenObtainPairSerializer
    

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = api_serializer.RegisterSerializer
    

class PasswordResetEmailVerifyAPIView(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = api_serializer.UserSerializer

    def get_object(self):
        email = self.kwargs['email']
        user = User.objects.filter(email=email).first()

        if user:
            link = send_otp_email(
                user=user,
                otp_type="create-new-password",
                template_name="password_reset",
                subject="Password Reset Request"
            )
            print("Password Reset Link:", link)
        return user


class PasswordChangeAPIView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = api_serializer.UserSerializer

    def create(self, request, *args, **kwargs):
        payload = request.data

        otp = payload['otp']
        uuidb64 = payload['uuidb64']
        password = payload['password']

        try:
            user = User.objects.get(id=uuidb64, otp=otp)

            # Vérification si le nouveau mot de passe est identique à l'ancien
            if check_password(password, user.password):
                return Response(
                    {"message": "Le nouveau mot de passe ne peut pas être le même que l'ancien.", "icon": "warning"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(password)
            user.otp = ""
            user.save()

            return Response({"message": "Mot de passe modifié avec succès.", "icon": "success"}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"message": "Reconnectez-vous pour changer votre mot de passe.", "icon": "error"}, status=status.HTTP_404_NOT_FOUND)
