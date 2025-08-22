from django.contrib.auth.password_validation import validate_password
from project.models import Commercial
from projectowner.models import Owner
from rest_framework import serializers
from .models import Profile, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.translation import gettext_lazy as _
import re


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

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    full_name = serializers.CharField(max_length=100, required=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    country_code = serializers.CharField(max_length=5, required=False, allow_blank=True)
    profession = serializers.CharField(required=False, allow_blank=True)
    age = serializers.IntegerField(required=False, allow_null=True)
    affiliate = serializers.CharField(required=False, allow_blank=True, write_only=True)  # Champ ajouté explicitement

    class Meta:
        model = User
        fields = ('full_name', 'email', 'country_code', 'phone', 'profession', 'password', 'age', 'affiliate')

    def validate(self, attrs):
        # Valider le code pays
        country_code = attrs.get('country_code')
        if country_code and not re.match(r'^\+\d{1,3}$', country_code):
            raise serializers.ValidationError({"country_code": _("Le code pays doit être au format + suivi de 1 à 3 chiffres (ex. +33).")})

        # Valider le numéro de téléphone
        phone = attrs.get('phone')
        if phone and not re.match(r'^\d{7,15}$', phone):
            raise serializers.ValidationError({"phone": _("Le numéro de téléphone doit contenir entre 7 et 15 chiffres.")})

        # Valider l'âge
        age = attrs.get('age')
        if age and (age < 18 or age > 120):
            raise serializers.ValidationError({"age": _("L'âge doit être compris entre 18 et 120 ans.")})

        # Valider le lien d'affiliation
        affiliate = attrs.get('affiliate')
        if affiliate:
            try:
                # Recherche exacte ou partielle selon le format de affiliate_link
                commercial = Commercial.objects.get(affiliate_link=affiliate)  # Recherche exacte
                attrs['commercial'] = commercial  # Stocker le commercial pour la création
            except Commercial.DoesNotExist:
                raise serializers.ValidationError({"affiliate": _("Lien d'affiliation invalide.")})
            except Commercial.MultipleObjectsReturned:
                raise serializers.ValidationError({"affiliate": _("Plusieurs commerciaux correspondent à ce lien d'affiliation.")})

        return attrs

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("Cet email est déjà utilisé."))
        return value

    def create(self, validated_data):
        # Extraire les champs
        phone = validated_data.pop('phone', None)
        country_code = validated_data.pop('country_code', None)
        profession = validated_data.pop('profession', None)
        age = validated_data.pop('age', None)
        commercial = validated_data.pop('commercial', None)  # Récupérer le commercial validé

        # Générer un username basé sur l'email
        email = validated_data['email']
        base_username = email.split('@')[0]
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        # Créer l'utilisateur avec user_type='owner'
        user = User.objects.create_user(
            email=validated_data['email'],
            username=username,
            full_name=validated_data['full_name'],
            password=validated_data['password'],
            user_type='owner'
        )

        # Créer le profil Owner avec le commercial
        owner = Owner.objects.create(
            user=user,
            full_name=user.full_name,
            phone=phone,
            country_code=country_code,
            profession=profession,
            age=age,
            commercial=commercial
        )

        return user


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
            raise serializers.ValidationError(_("Cet email est déjà utilisé."))
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
    class Meta:
        model = User
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
    

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


