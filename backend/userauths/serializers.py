from django.contrib.auth.password_validation import validate_password
from project.models import Commercial, Category, Project
# from project.serializers import ProjectCreateUpdateSerializer
from rest_framework.validators import UniqueValidator

from rest_framework import serializers
from .models import Profile, User
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


