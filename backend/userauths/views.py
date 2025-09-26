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
from rest_framework import serializers

import json

import logging
logger = logging.getLogger(__name__)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = api_serializer.MyTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as e:
            # Personnaliser la réponse d'erreur
            return Response(
                {
                    "error": [
                        "Aucun compte actif avec les informations de connexion fournies"
                    ]
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


    
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

# class RegisterViewAPIView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]
#     parser_classes = [JSONParser, MultiPartParser, FormParser]
#     serializer_class = register_serializer.RegisterSerializer
    
    
#     # def create(self, request, *args, **kwargs):
#     #     serializer = self.get_serializer(data=request.data)
#     #     serializer.is_valid(raise_exception=True)
#     #     response_data = serializer.save()
#     #     return Response(response_data, status=status.HTTP_201_CREATED)
    
#     def create(self, request, *args, **kwargs):
#         # Si c'est du FormData, le projet sera stringifié
#         if request.content_type.startswith('multipart/'):
#             # Désérialiser le JSON du projet s'il est stringifié
#             if 'project' in request.data and isinstance(request.data['project'], str):
#                 import json
#                 try:
#                     request.data._mutable = True  # Permettre la modification
#                     request.data['project'] = json.loads(request.data['project'])
#                 except json.JSONDecodeError:
#                     pass
        
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         response_data = serializer.save()
#         return Response(response_data, status=status.HTTP_201_CREATED)
    

# class RegisterViewAPIView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]
#     parser_classes = [JSONParser, MultiPartParser, FormParser]
#     serializer_class = register_serializer.RegisterSerializer
    
#     def create(self, request, *args, **kwargs):
#         print(f"🔍 DEBUG - Content-Type: {request.content_type}")
#         print(f"🔍 DEBUG - Request data keys: {list(request.data.keys())}")
        
#         try:
#             # 🔧 SOLUTION ALTERNATIVE: Préprocesser sans modifier request.data
#             processed_data = self.preprocess_form_data(request)
            
#             # Créer un nouveau serializer avec les données préprocessées
#             serializer = self.get_serializer(data=processed_data)
            
#             if not serializer.is_valid():
#                 print(f"❌ DEBUG - Erreurs de validation: {serializer.errors}")
#                 return Response({
#                     "error": serializer.errors
#                 }, status=status.HTTP_400_BAD_REQUEST)
            
#             print("✅ DEBUG - Validation réussie, création en cours...")
#             response_data = serializer.save()
#             print("✅ DEBUG - Création terminée avec succès")
            
#             return Response(response_data, status=status.HTTP_201_CREATED)
            
#         except Exception as e:
#             print(f"❌ DEBUG - Erreur inattendue: {str(e)}")
#             logger.exception("Erreur lors de la création du compte")
#             return Response({
#                 "error": {
#                     "non_field_errors": [f"Erreur interne: {str(e)}"]
#                 }
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#     def preprocess_form_data(self, request):
#         """
#         Préprocesse les données FormData sans modifier l'objet request original
#         """
#         print("🔍 DEBUG - Préprocessing des données...")
        
#         # Créer un dictionnaire simple pour les données
#         processed_data = {}
        
#         # Copier les données textuelles
#         for key, value in request.data.items():
#             if key == 'project':
#                 # Traitement spécial pour le projet
#                 if isinstance(value, str):
#                     print(f"🔍 DEBUG - Project data (string): {value[:200]}...")
#                     try:
#                         project_data = json.loads(value)
#                         processed_data[key] = project_data
#                         print("✅ DEBUG - Project JSON désérialisé avec succès")
#                         print(f"🔍 DEBUG - Project data: {project_data}")
#                     except json.JSONDecodeError as e:
#                         print(f"❌ DEBUG - Erreur JSON: {str(e)}")
#                         raise ValueError(f"Format JSON invalide pour le projet: {str(e)}")
#                 else:
#                     processed_data[key] = value
#             elif key in ['accept_project_reformulation', 'accept_terms_of_use']:
#                 # Normaliser les booléens
#                 str_value = str(value).lower()
#                 if str_value in ['true', '1', 'on', 'yes']:
#                     processed_data[key] = True
#                 elif str_value in ['false', '0', 'off', 'no']:
#                     processed_data[key] = False
#                 else:
#                     processed_data[key] = value
#                 print(f"🔍 DEBUG - Booléen {key}: {processed_data[key]} (original: {value})")
#             else:
#                 processed_data[key] = value
        
#         if 'project.image' in request.FILES:
#             processed_data['project']['image'] = request.FILES['project.image']
#             print(f"🔍 DEBUG - Fichier project.image: {request.FILES['project.image'].name}")
#         if 'project.file' in request.FILES:
#             processed_data['project']['file'] = request.FILES['project.file']
#             print(f"🔍 DEBUG - Fichier project.file: {request.FILES['project.file'].name}")
    
        
#         print("✅ DEBUG - Préprocessing terminé")
#         return processed_data



class RegisterWithPaymentViewAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    serializer_class = register_serializer.RegisterOwnerWithPaymentSerializer
    
    def create(self, request, *args, **kwargs):
        print(f"🔍 DEBUG - Content-Type: {request.content_type}")
        print(f"🔍 DEBUG - Request data keys: {list(request.data.keys())}")
        
        try:
            # 🔧 SOLUTION ALTERNATIVE: Préprocesser sans modifier request.data
            processed_data = self.preprocess_form_data(request)
            
            # Créer un nouveau serializer avec les données préprocessées
            serializer = self.get_serializer(data=processed_data)
            
            if not serializer.is_valid():
                print(f"❌ DEBUG - Erreurs de validation: {serializer.errors}")
                return Response({
                    "error": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            print("✅ DEBUG - Validation réussie, création en cours...")
            response_data = serializer.save()
            print("✅ DEBUG - Création terminée avec succès")
            
            return Response({
                'success': True,
                'message': _('Inscription et soumission réussies'),
                'data': response_data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"❌ DEBUG - Erreur inattendue: {str(e)}")
            logger.exception("Erreur lors de la création du compte avec paiement")
            return Response({
                "error": {
                    "non_field_errors": [f"Erreur interne: {str(e)}"]
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def preprocess_form_data(self, request):
        """
        Préprocesse les données avec gestion du paiement
        """
        print("🔍 DEBUG - Préprocessing des données...")
        
        # Créer un dictionnaire simple pour les données
        processed_data = {}
        
        # Copier les données textuelles
        for key, value in request.data.items():
            if key == 'project':
                # Traitement spécial pour le projet
                if isinstance(value, str):
                    print(f"🔍 DEBUG - Project data (string): {value[:200]}...")
                    try:
                        project_data = json.loads(value)
                        processed_data[key] = project_data
                        print("✅ DEBUG - Project JSON désérialisé avec succès")
                        print(f"🔍 DEBUG - Project data: {project_data}")
                    except json.JSONDecodeError as e:
                        print(f"❌ DEBUG - Erreur JSON: {str(e)}")
                        raise ValueError(f"Format JSON invalide pour le projet: {str(e)}")
                else:
                    processed_data[key] = value
                    
            elif key == 'project_payment':
                if isinstance(value, str):
                    try:
                        payment_data = json.loads(value)
                        processed_data[key] = payment_data
                    except json.JSONDecodeError as e:
                        raise ValueError(f"Format JSON invalide pour le paiement: {str(e)}")
                else:
                    processed_data[key] = value
                    
            elif key in ['accept_project_reformulation', 'accept_terms_of_use']:
                # Normaliser les booléens
                str_value = str(value).lower()
                if str_value in ['true', '1', 'on', 'yes']:
                    processed_data[key] = True
                elif str_value in ['false', '0', 'off', 'no']:
                    processed_data[key] = False
                else:
                    processed_data[key] = value
                print(f"🔍 DEBUG - Booléen {key}: {processed_data[key]} (original: {value})")
            else:
                processed_data[key] = value
        
        # Gérer les fichiers
        
        if 'project.image' in request.FILES:
            processed_data['project']['image'] = request.FILES['project.image']
            print(f"🔍 DEBUG - Fichier project.image: {request.FILES['project.image'].name}")
        if 'project.file' in request.FILES:
            processed_data['project']['file'] = request.FILES['project.file']
            print(f"🔍 DEBUG - Fichier project.file: {request.FILES['project.file'].name}")
    
        
        print("✅ DEBUG - Préprocessing terminé")
        return processed_data
            
            
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
    

