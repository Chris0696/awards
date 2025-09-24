from project.serializers import CommercialSerializer
from userauths.serializers import UserSerializer
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _

from .models import *
from django.db import transaction


class OwnerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    commercial = CommercialSerializer(read_only=True)
    total_projects = serializers.SerializerMethodField()
    published_projects = serializers.SerializerMethodField()
    rejected_projects = serializers.SerializerMethodField()
    total_votes_received = serializers.SerializerMethodField()

    class Meta:
        model = Owner
        fields = [
            'id', 'user', 'image', 'full_name', 'phone', 'country_code', 'profession', 'age', 'commercial',
            'created_at', 'total_projects', 'published_projects', 'rejected_projects', 'total_votes_received'
        ]

    def get_total_projects(self, obj):
        return obj.total_projects()
    
    def get_published_projects(self, obj):
        return obj.published_projects()
    
    def get_rejected_projects(self, obj):
        return obj.rejected_projects()
    
    def get_total_votes_received(self, obj):
        return obj.total_votes_received()
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Formater les erreurs dans le style souhaité si nécessaire
        return data

# Fonctionnalité CRUD des Owners
class OwnerListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des Owner (vue d'ensemble)"""
    user = UserSerializer(read_only=True)
    commercial = CommercialSerializer(read_only=True)
    total_projects = serializers.SerializerMethodField()
    published_projects = serializers.SerializerMethodField()
    rejected_projects = serializers.SerializerMethodField()
    total_votes_received = serializers.SerializerMethodField()
    
    class Meta:
        model = Owner
        fields = [
            'id', 'user', 'full_name', 'phone', 'country_code', 
            'profession', 'age', 'commercial', 'created_at',
            'accept_project_reformulation', 'accept_terms_of_use',
            'total_projects', 'published_projects', 'rejected_projects', 'total_votes_received'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_total_projects(self, obj):
        return obj.total_projects()
    
    def get_published_projects(self, obj):
        return obj.published_projects()
    
    def get_total_votes_received(self, obj):
        return obj.total_votes_received()
    
    def get_rejected_projects(self, obj):
        return obj.rejected_projects()
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Formater les erreurs dans le style souhaité si nécessaire
        return data


class OwnerDetailSerializer(serializers.ModelSerializer):
    """Serializer pour le détail complet d'un Owner"""
    user = UserSerializer(read_only=True)
    commercial = CommercialSerializer(read_only=True)
    projects = serializers.SerializerMethodField()
    
    class Meta:
        model = Owner
        fields = [
            'id', 'user', 'image', 'full_name', 'phone', 'country_code',
            'profession', 'age', 'commercial', 'created_at',
            'accept_project_reformulation', 'accept_terms_of_use',
            'projects'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_projects(self, obj):
        """Retourner la liste des projets de cet owner"""
        from project.serializers import ProjectListSerializer  # Import local pour éviter les cycles
        projects = obj.project_set.all()[:10]  # Limiter à 10 projets récents
        return ProjectListSerializer(projects, many=True).data


class OwnerUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour la mise à jour d'un Owner par l'admin"""
    user_email = serializers.EmailField(source='user.email', required=False)
    user_is_active = serializers.BooleanField(source='user.is_active', required=False)
    user_full_name = serializers.CharField(source='user.full_name', required=False, max_length=100)
    commercial_id = serializers.PrimaryKeyRelatedField(
        queryset=Commercial.objects.all(),
        source='commercial',
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Owner
        fields = [
            'full_name', 'phone', 'country_code', 'profession', 'age',
            'image', 'accept_project_reformulation', 'accept_terms_of_use',
            'user_email', 'user_is_active', 'user_full_name', 'commercial_id'
        ]
    
    def validate_phone(self, value):
        """Valider le format du téléphone"""
        if value and not re.match(r'^\d{7,15}$', value):
            raise serializers.ValidationError(
                "Le numéro de téléphone doit contenir entre 7 et 15 chiffres."
            )
        return value
    
    def validate_country_code(self, value):
        """Valider le format du code pays"""
        if value and not re.match(r'^\+\d{1,3}$', value):
            raise serializers.ValidationError(
                "Le code pays doit être au format + suivi de 1 à 3 chiffres (ex. +33)."
            )
        return value
    
    def validate_age(self, value):
        """Valider l'âge"""
        if value and (value < 18 or value > 120):
            raise serializers.ValidationError(
                "L'âge doit être compris entre 18 et 120 ans."
            )
        return value
    
    def validate_user_email(self, value):
        """Valider l'unicité de l'email (exclure l'utilisateur actuel)"""
        if value:
            current_user = self.instance.user if self.instance else None
            if User.objects.filter(email=value).exclude(pk=current_user.pk if current_user else None).exists():
                raise serializers.ValidationError("Cet email est déjà utilisé par un autre utilisateur.")
        return value
    
    @transaction.atomic
    def update(self, instance, validated_data):
        # Extraire les données utilisateur
        user_data = {}
        if 'user' in validated_data:
            user_data = validated_data.pop('user')
        
        # Extraire le commercial
        commercial = validated_data.pop('commercial', None)
        if commercial is not None:
            instance.commercial = commercial
        
        # Mettre à jour l'Owner
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Synchroniser le full_name entre Owner et User si modifié
        if 'full_name' in validated_data:
            instance.user.full_name = validated_data['full_name']
            user_data['full_name'] = validated_data['full_name']
        
        # Mettre à jour l'User si nécessaire
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        
        instance.save()
        return instance


class OwnerCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un Owner (optionnel pour admin)"""
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    commercial_id = serializers.PrimaryKeyRelatedField(
        queryset=Commercial.objects.all(),
        source='commercial',
        required=False,
        allow_null=True,
        write_only=True
    )
    
    class Meta:
        model = Owner
        fields = [
            'full_name', 'email', 'password', 'phone', 'country_code',
            'profession', 'age', 'image', 'commercial_id',
            'accept_project_reformulation', 'accept_terms_of_use'
        ]
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Cet email est déjà utilisé.")
        return value
    
    def validate_phone(self, value):
        if value and not re.match(r'^\d{7,15}$', value):
            raise serializers.ValidationError(
                "Le numéro de téléphone doit contenir entre 7 et 15 chiffres."
            )
        return value
    
    def validate_country_code(self, value):
        if value and not re.match(r'^\+\d{1,3}$', value):
            raise serializers.ValidationError(
                "Le code pays doit être au format + suivi de 1 à 3 chiffres (ex. +33)."
            )
        return value
    
    def validate_age(self, value):
        if value and (value < 18 or value > 120):
            raise serializers.ValidationError(
                "L'âge doit être compris entre 18 et 120 ans."
            )
        return value
    
    @transaction.atomic
    def create(self, validated_data):
        # Extraire les données utilisateur
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        commercial = validated_data.pop('commercial', None)
        
        # Générer un username basé sur l'email
        base_username = email.split('@')[0]
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        # Créer l'utilisateur
        user = User.objects.create_user(
            email=email,
            username=username,
            full_name=validated_data['full_name'],
            password=password,
            user_type='owner'
        )
        
        # Créer l'Owner
        owner = Owner.objects.create(
            user=user,
            commercial=commercial,
            **validated_data
        )
        
        return owner


# class OwnerProfileSerializer(serializers.ModelSerializer):
   
#     # Champs liés à Profile
#     full_name = serializers.CharField(source='profile.full_name', required=True)
#     image = serializers.ImageField(source='profile.image', required=False)
#     profession = serializers.CharField(source='profile.profession', required=False)
#     phone = serializers.CharField(source='profile.phone', required=False)
#     age = serializers.IntegerField(required=False)



#     class Meta:
#         model = Owner
#         fields = [
#             # Champs Profile
#             'full_name', 'image', 'profession', 'phone', 'age',
#         ]

#     def update(self, instance, validated_data):
#         # Gestion des données liées à Profile
#         profile_data = validated_data.pop('profile', {})
#         if profile_data and instance.profile:
#             for attr, value in profile_data.items():
#                 setattr(instance.profile, attr, value)
#             instance.profile.save()
        
#         # Gestion des données Owner
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)

#         instance.save()
#         return instance


class OwnerProfileSerializer(serializers.ModelSerializer):
    # Utiliser les champs directement du modèle Owner
    full_name = serializers.CharField(required=True)
    image = serializers.ImageField(required=False)
    profession = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    age = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Owner
        fields = [
            'full_name', 'image', 'profession', 'phone', 'age', 
            
        ]

    def update(self, instance, validated_data):
        # Mise à jour directe des champs Owner
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
