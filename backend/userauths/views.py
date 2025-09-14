from django.shortcuts import render

from userauths.utils import send_otp_email
from .models import Profile, User
from userauths import serializers as api_serializer
from api import serializers as register_serializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework import generics, status
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from .serializers import AdminRegisterSerializer, ProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework.views import APIView
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser


import logging
logger = logging.getLogger(__name__)





class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = api_serializer.MyTokenObtainPairSerializer
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Blackliste le refresh token pour déconnecter l'utilisateur
        """
        try:
            # Récupérer le refresh token depuis le corps de la requête
            refresh_token_str = request.data.get('refresh')
            
            if not refresh_token_str:
                return Response(
                    {"error": {"refresh": [_("Le refresh token est requis.")]}},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Valider et blacklister le refresh token
            try:
                refresh_token = RefreshToken(refresh_token_str)
                refresh_token.blacklist()
                
                # Log pour debugging/monitoring
                logger.info(f"User {request.user.id} logged out successfully")
                
                return Response(
                    {"message": _("Déconnexion réussie.")},
                    status=status.HTTP_200_OK  # 200 est plus approprié qu'un 205
                )
                
            except TokenError as e:
                # Token invalide, expiré ou déjà blacklisté
                return Response(
                    {"error": {"refresh": [_("Le refresh token est invalide ou déjà blacklisté.")]}},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            # Log l'erreur pour debugging
            logger.error(f"Logout error for user {request.user.id}: {str(e)}")
            
            return Response(
                {"error": {"non_field_errors": [_("Une erreur inattendue s'est produite.")]}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            

class CustomTokenRefreshView(TokenRefreshView):
    """
    Vue personnalisée pour le rafraîchissement de token avec gestion d'erreurs améliorée
    """
    
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
            
        except TokenError as e:
            # Gestion spécifique des différents types d'erreurs de token
            error_message = str(e).lower()
            
            if "blacklisted" in error_message:
                return Response(
                    {
                        "error": {
                            "refresh": [_("Le token est blacklisté, veuillez vous reconnecter.")]
                        }
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
            elif "expired" in error_message:
                return Response(
                    {
                        "error": {
                            "refresh": [_("Le token a expiré, veuillez vous reconnecter.")]
                        }
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
            elif "invalid" in error_message:
                return Response(
                    {
                        "error": {
                            "refresh": [_("Le token est invalide.")]
                        }
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
            else:
                # Erreur générique
                return Response(
                    {
                        "error": {
                            "refresh": [_("Erreur de token, veuillez vous reconnecter.")]
                        }
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            # Log l'erreur pour debugging
            logger.error(f"Token refresh error: {str(e)}")
            
            return Response(
                {
                    "error": {
                        "non_field_errors": [_("Une erreur inattendue s'est produite.")]
                    }
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RegisterViewAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    serializer_class = register_serializer.RegisterSerializer
    
    
    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     response_data = serializer.save()
    #     return Response(response_data, status=status.HTTP_201_CREATED)
    
    def create(self, request, *args, **kwargs):
        # Si c'est du FormData, le projet sera stringifié
        if request.content_type.startswith('multipart/'):
            # Désérialiser le JSON du projet s'il est stringifié
            if 'project' in request.data and isinstance(request.data['project'], str):
                import json
                try:
                    request.data._mutable = True  # Permettre la modification
                    request.data['project'] = json.loads(request.data['project'])
                except json.JSONDecodeError:
                    pass
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response_data = serializer.save()
        return Response(response_data, status=status.HTTP_201_CREATED)
    

class AdminRegisterViewAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = AdminRegisterSerializer
    

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


class ProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        return Profile.objects.get(user=user)
    

