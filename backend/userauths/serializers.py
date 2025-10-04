from django.contrib.auth.password_validation import validate_password
from project.models import Commercial, Category, Project
# from project.serializers import ProjectCreateUpdateSerializer
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate

from rest_framework import serializers
from .models import ContactMessage, Profile, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.translation import gettext_lazy as _
import re
from django.db import transaction


USER_TYPES = (
    ("admin", _("Administrateur")),
    ("owner", _("Auteur de projet")),
    ("commercial", _("Commercial")),
    ("user", _("Admin ou Utilisateur")),
)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['full_name'] = user.full_name
        token['email'] = user.email
        token['username'] = user.username
        token['user_type'] = user.user_type
        
        return token
    
    def validate(self, attrs):
        # Récupérer les données d'authentification
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            # Authentifier l'utilisateur
            user = authenticate(
                request=self.context.get('request'),
                email=email,
                password=password
            )
            
            print("user=====", user)
            
            if not user:
                # Si l'authentification échoue, lever une exception personnalisée
                raise serializers.ValidationError(
                    "Email ou mot de passe incorrect, veuillez essayer de nouveau."
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    "Le compte utilisateur est désactivé"
                )
        else:
            raise serializers.ValidationError(
                "Nom d'utilisateur et mot de passe requis"
            )
        
        # Appeler la méthode parent pour obtenir les tokens
        return super().validate(attrs)
    


class AdminRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    
    username = serializers.CharField(required=False, allow_blank=True, max_length=100)
    user_type = serializers.ChoiceField(choices=[('admin', 'Administrateur'), ('commercial', 'Commercial')])

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'user_type')

    def validate(self, attrs):
        # Autoriser les superusers ou les utilisateurs avec user_type='admin'
        request = self.context.get('request')
        if not request.user.is_authenticated or (request.user.user_type != 'admin' and not request.user.is_superuser):
            raise serializers.ValidationError({"user_type": _("Seul un administrateur ou un superuser peut créer un utilisateur de type admin ou commercial.")})
        
        return attrs

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError({
                "error" :{
                    "email": _("Cet email est déjà utilisé.")
                }
                })
        return value

    def validate_username(self, value):
        if value and User.objects.filter(username=value).exists():
            raise serializers.ValidationError(_("Ce nom d'utilisateur existe déjà, veuillez en choisir un autre."))
        return value

    def create(self, validated_data):
        user_type = validated_data.pop('user_type')
        
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('username', ''),
            password=validated_data['password'],
            user_type=user_type
        )
        
        if user_type == 'commercial':
            Commercial.objects.create(
                user=user,
                full_name=user.username or user.email.split('@')[0]
            )
        
        return user
    

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        write_only=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message=_("Cet email est déjà utilisé.")
            )
        ]
    )

    class Meta:
        model = User
        fields = ['email', 'username', 'full_name', 'phone', 'user_type', 'is_active']
        read_only_fields = ['username', 'user_type', 'is_active']

    def to_internal_value(self, data):
        try:
            return super().to_internal_value(data)
        except serializers.ValidationError as e:
            errors = {"error": {}}
            for field, messages in e.detail.items():
                # Gérer les erreurs de champ (par exemple, email)
                if isinstance(messages, list):
                    errors["error"][field] = messages
                else:
                    errors["error"][field] = [messages]
            raise serializers.ValidationError(errors)
        

# class ChangePasswordSerializer(serializers.Serializer):
#     old_password = serializers.CharField(required=True, write_only=True)
#     new_password = serializers.CharField(required=True, write_only=True, min_length=8)
#     confirm_password = serializers.CharField(required=True, write_only=True)
    
#     def validate_new_password(self, value):
#         """Validation personnalisée du nouveau mot de passe"""
#         if len(value) < 8:
#             raise serializers.ValidationError(
#                 "Le mot de passe doit contenir au moins 8 caractères."
#             )
        
#         # Ajouter d'autres validations si besoin
#         if not any(char.isdigit() for char in value):
#             raise serializers.ValidationError(
#                 "Le mot de passe doit contenir au moins un chiffre."
#             )
        
#         if not any(char.isupper() for char in value):
#             raise serializers.ValidationError(
#                 "Le mot de passe doit contenir au moins une lettre majuscule."
#             )
        
#         return value
    
#     def validate(self, attrs):
#         if attrs['new_password'] != attrs['confirm_password']:
#             raise serializers.ValidationError({
#                 "confirm_password": "Les mots de passe ne correspondent pas."
#             })
#         return attrs

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        required=True,
        write_only=True,
        error_messages={
            'required': 'L\'ancien mot de passe est requis.',
            'blank': 'L\'ancien mot de passe ne peut pas être vide.'
        }
    )
    
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        min_length=8,
        error_messages={
            'required': 'Le nouveau mot de passe est requis.',
            'blank': 'Le nouveau mot de passe ne peut pas être vide.',
            'min_length': 'Le mot de passe doit contenir au moins 8 caractères.'
        }
    )
    
    confirm_password = serializers.CharField(
        required=True,
        write_only=True,
        error_messages={
            'required': 'La confirmation du mot de passe est requise.',
            'blank': 'La confirmation ne peut pas être vide.'
        }
    )
    
    def validate(self, attrs):
        # Vérifier que les mots de passe correspondent
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                "confirm_password": "Les mots de passe ne correspondent pas."
            })
        return attrs
    
    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour mettre à jour les utilisateurs admin"""
    
    class Meta:
        model = User
        fields = ['username', 'email', 'full_name', 'phone', 'is_active']

    def validate_email(self, value):
        # Vérifier que l'email n'est pas déjà utilisé par un autre utilisateur
        if self.instance and self.instance.email != value:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError(_("Cet email est déjà utilisé."))
        return value

    def validate_username(self, value):
        # Vérifier que le username n'est pas déjà utilisé par un autre utilisateur
        if self.instance and self.instance.username != value:
            if value and User.objects.filter(username=value).exists():
                raise serializers.ValidationError(_("Ce nom d'utilisateur existe déjà."))
        return value

    def validate_phone(self, value):
        if value and not re.match(r'^\d{7,15}$', value):
            raise serializers.ValidationError(_("Le numéro de téléphone doit contenir entre 7 et 15 chiffres."))
        return value
    

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'full_name', 'email', 'phone', 'subject', 'message', 'created_at']

    def validate_phone(self, value):
        """Valider le numéro de téléphone avec code pays inclus"""
        if not value.startswith('+'):
            raise serializers.ValidationError(_("Le numéro de téléphone doit commencer par + (ex: +2290155662555)."))
        if len(value) < 8 or len(value) > 20:
            raise serializers.ValidationError(_("Le numéro de téléphone doit contenir entre 8 et 20 caractères."))
        return value
        
    
    
# === SERIALIZERS STATISTIQUES ===
class DashboardStatsSerializer(serializers.Serializer):
    """Serializer pour les statistiques générales du dashboard"""
    total_projects = serializers.IntegerField()
    validated_projects = serializers.IntegerField()
    rejected_projects = serializers.IntegerField()
    pending_projects = serializers.IntegerField()
    total_votes = serializers.IntegerField()
    total_users = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    validation_rate = serializers.DecimalField(max_digits=5, decimal_places=2)


