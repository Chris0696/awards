
from rest_framework import serializers
from project.models import Commercial
from django.utils.translation import gettext_lazy as _
import re
from userauths.models import User, USER_TYPES
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from django.core.validators import RegexValidator





class CommercialSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    total_projects = serializers.IntegerField(source='total_projects_brought', read_only=True)
    total_published_projects = serializers.IntegerField(read_only=True)
    total_rejected_projects = serializers.IntegerField(read_only=True)
    total_votes = serializers.IntegerField(source='total_votes_generated', read_only=True)
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2, source='total_revenue_generated', read_only=True)
    commission_earned = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Commercial
        fields = [
            'id', 'user_email', 'full_name', 'phone', 'commission_rate', 'affiliate_link',
            'is_active', 'created_at', 'total_projects', 'total_published_projects',
            'total_rejected_projects', 'total_votes', 'total_revenue', 'commission_earned'
        ]
        read_only_fields = ['affiliate_link', 'created_at']

    def validate_phone(self, value):
        if value and not re.match(r'^\d{7,15}$', value):
            raise serializers.ValidationError(_("Le numéro de téléphone doit contenir entre 7 et 15 chiffres."))
        return value

    def validate_commission_rate(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(_("Le taux de commission doit être compris entre 0 et 100%."))
        return value


# class AdminCommercialRegisterSerializer(serializers.ModelSerializer):
#     phone = serializers.CharField(max_length=25, required=True)
#     user_type = serializers.ChoiceField(choices=USER_TYPES, required=True)
#     password = serializers.CharField(
#         write_only=True,
#         required=True,
#         min_length=8,
#         validators=[validate_password],
#         style={'input_type': 'password'}
#     )
#     username = serializers.CharField(required=False, allow_blank=True, max_length=100)
    
#     class Meta:
#         model = User
#         fields = ['email', 'password', 'username', 'phone', 'user_type']

#     def validate_phone(self, value):
#         if not re.match(r'^\d{7,15}$', value):
#             raise serializers.ValidationError("Le numéro de téléphone doit contenir entre 7 et 15 chiffres.")
#         if User.objects.filter(phone=value).exists():
#             raise serializers.ValidationError("Ce numéro de téléphone est déjà utilisé.")
#         return value

#     def validate_email(self, value):
#         if User.objects.filter(email=value).exists():
#             raise serializers.ValidationError({
#                 "error" :{
#                     "email": _("Cet email est déjà utilisé.")
#                 }
#                 })
#         return value
    
#     def validate(self, attrs):
#         # Autoriser les superusers ou les utilisateurs avec user_type='admin'
#         request = self.context.get('request')
#         if not request.user.is_authenticated or (request.user.user_type != 'admin' and not request.user.is_superuser):
#             raise serializers.ValidationError({"user_type": _("Seul un administrateur ou un superuser peut créer un utilisateur de type admin ou commercial.")})
        
#         return attrs

#     def validate_user_type(self, value):
#         allowed_types = ['admin', 'commercial']  # Limiter aux types admin et commercial
#         if value not in allowed_types:
#             raise serializers.ValidationError("Le type d'utilisateur doit être 'admin' ou 'commercial'.")
#         return value
    
#     def create(self, validated_data):
#         user_type = validated_data.pop('user_type')
#         password = validated_data.pop('password')
#         # Créer l'utilisateur
#         user = User.objects.create_user(
#             email=validated_data['email'],
#             username=validated_data.get('username', ''),
#             password=password,
#             phone=validated_data['phone'],
#             user_type=user_type,
#             is_active=True
#         )

#         # Si c'est un commercial, créer l'entrée correspondante dans le modèle Commercial
#         if user_type == 'commercial':
#             Commercial.objects.create(
#                 user=user,
#                 full_name=user.username or user.email.split('@')[0],
#                 phone=validated_data['phone'],
#                 commission_rate=10.00  # Valeur par défaut ou configurable
#             )

#         return user

class AdminCommercialRegisterSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(max_length=25, required=True)
    user_type = serializers.ChoiceField(choices=USER_TYPES, required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    username = serializers.CharField(required=False, allow_blank=True, max_length=100)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'username', 'phone', 'user_type']

    def validate_phone(self, value):
        if not re.match(r'^\d{7,15}$', value):
            raise serializers.ValidationError(_("Le numéro de téléphone doit contenir entre 7 et 15 chiffres."))
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError(_("Ce numéro de téléphone est déjà utilisé."))
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("Cet email est déjà utilisé."))
        return value
    
    def validate(self, attrs):
        # Autoriser les superusers ou les utilisateurs avec user_type='admin'
        request = self.context.get('request')
        if not request.user.is_authenticated or (request.user.user_type != 'admin' and not request.user.is_superuser):
            raise serializers.ValidationError({
                "permission": _("Seul un administrateur ou un superuser peut créer un utilisateur de type admin ou commercial.")
            })
        
        return attrs

    def validate_user_type(self, value):
        allowed_types = ['admin', 'commercial']
        if value not in allowed_types:
            raise serializers.ValidationError(_("Le type d'utilisateur doit être 'admin' ou 'commercial'."))
        return value
    
    def create(self, validated_data):
        try:
            user_type = validated_data.pop('user_type')
            password = validated_data.pop('password')
            
            # Créer l'utilisateur
            user = User.objects.create_user(
                email=validated_data['email'],
                username=validated_data.get('username', ''),
                password=password,
                phone=validated_data['phone'],
                user_type=user_type,
                is_active=True
            )

            # Si c'est un commercial, créer l'entrée correspondante dans le modèle Commercial
            if user_type == 'commercial':
                Commercial.objects.create(
                    user=user,
                    full_name=user.username or user.email.split('@')[0],
                    phone=validated_data['phone'],
                    commission_rate=10.00
                )

            return user
        except Exception as e:
            raise serializers.ValidationError({
                "creation_error": _("Erreur lors de la création de l'utilisateur: {}").format(str(e))
            })
    
# class AdminCommercialCreateSerializer(serializers.ModelSerializer):
#     """Serializer unifié pour créer admin et commerciaux"""
#     password = serializers.CharField(
#         write_only=True,
#         required=True,
#         min_length=8,
#         validators=[validate_password],
#         style={'input_type': 'password'}
#     )
    
#     username = serializers.CharField(required=False, allow_blank=True, max_length=100)
#     user_type = serializers.ChoiceField(choices=[('admin', 'Administrateur'), ('commercial', 'Commercial')])
    
#     # Champs pour le profil Commercial/Admin
#     full_name = serializers.CharField(max_length=200, required=True)
#     phone = serializers.CharField(
#         max_length=20,
#         required=True,
#         validators=[RegexValidator(r'^\d{7,15}$', message=_("Le numéro de téléphone doit contenir entre 7 et 15 chiffres."))]
#     )
#     commission_rate = serializers.DecimalField(
#         max_digits=5, decimal_places=2, 
#         required=False, default=0.00,
#         help_text=_("Taux de commission pour les commerciaux (0-100%)")
#     )

#     class Meta:
#         model = User
#         fields = ('username', 'email', 'password', 'user_type', 'full_name', 'phone', 'commission_rate')

#     def validate(self, attrs):
#         # Vérifier les permissions
#         request = self.context.get('request')
#         if not request.user.is_authenticated or (request.user.user_type != 'admin' and not request.user.is_superuser):
#             raise serializers.ValidationError({
#                 "user_type": _("Seul un administrateur ou un superuser peut créer un utilisateur de type admin ou commercial.")
#             })
        
#         # Validation spécifique pour les commerciaux
#         if attrs.get('user_type') == 'commercial':
#             commission_rate = attrs.get('commission_rate', 0)
#             if commission_rate < 0 or commission_rate > 100:
#                 raise serializers.ValidationError({
#                     "commission_rate": _("Le taux de commission doit être compris entre 0 et 100%.")
#                 })
        
#         return attrs

#     def validate_email(self, value):
#         if User.objects.filter(email=value).exists():
#             raise serializers.ValidationError(_("Cet email est déjà utilisé."))
#         return value

#     def validate_username(self, value):
#         if value and User.objects.filter(username=value).exists():
#             raise serializers.ValidationError(_("Ce nom d'utilisateur existe déjà."))
#         return value

#     @transaction.atomic
#     def create(self, validated_data):
#         try:
#             user_type = validated_data.pop('user_type')
#             full_name = validated_data.pop('full_name')
#             phone = validated_data.pop('phone')
#             commission_rate = validated_data.pop('commission_rate', 0.00)

#             # Créer l'utilisateur
#             user = User.objects.create_user(
#                 email=validated_data['email'],
#                 username=validated_data.get('username', ''),
#                 password=validated_data['password'],
#                 user_type=user_type,
#                 phone=phone,
#                 full_name=full_name
#             )
            
#             # Vérifier que l'utilisateur a été créé
#             if not user:
#                 raise serializers.ValidationError("Échec de la création de l'utilisateur.")

#             # Créer le profil correspondant si commercial
#             if user_type == 'commercial':
#                 try:
#                     commercial = Commercial.objects.create(
#                         user=user,
#                         full_name=full_name,
#                         phone=phone,
#                         commission_rate=commission_rate
#                     )
#                     if not commercial:
#                         raise serializers.ValidationError("Échec de la création du profil commercial.")
#                 except Exception as e:
#                     user.delete()  # Annuler la création de l'utilisateur en cas d'erreur
#                     raise serializers.ValidationError(f"Erreur lors de la création du profil commercial: {str(e)}")

#             return user
#         except Exception as e:
#             raise serializers.ValidationError(f"Erreur dans la méthode create: {str(e)}")


# class AdminCommercialDetailSerializer(serializers.ModelSerializer):
#     """Serializer pour afficher les détails d'un utilisateur commercial"""
#     commercial_info = serializers.SerializerMethodField()
    
#     class Meta:
#         model = User
#         fields = [
#             'id', 'username', 'email', 'full_name', 'phone', 'user_type',
#             'is_active', 'date_joined', 'last_login', 'commercial_info'
#         ]

#     def get_commercial_info(self, obj):
#         if hasattr(obj, 'commercial'):
#             commercial = obj.commercial
#             return {
#                 'commercial_id': commercial.id,
#                 'full_name': commercial.full_name,
#                 'phone': commercial.phone,
#                 'commission_rate': float(commercial.commission_rate),
#                 'affiliate_link': commercial.affiliate_link,
#                 'is_active': commercial.is_active,
#                 'created_at': commercial.created_at,
#                 'total_projects': commercial.total_projects_brought(),
#                 'total_published_projects': commercial.total_published_projects(),
#                 'total_rejected_projects': commercial.total_rejected_projects(),
#                 'total_votes': commercial.total_votes_generated(),
#                 'total_revenue': float(commercial.total_revenue_generated()),
#                 'commission_earned': float(commercial.commission_earned())
#             }
#         return None
    

# class AdminCommercialUpdateSerializer(serializers.ModelSerializer):
#     """Serializer pour mettre à jour les commerciaux"""
#     user_email = serializers.EmailField(source='user.email', required=False)
#     user_full_name = serializers.CharField(source='user.full_name', required=False)
#     user_phone = serializers.CharField(source='user.phone', required=False)
#     user_is_active = serializers.BooleanField(source='user.is_active', required=False)
    
#     # Statistiques (lecture seule)
#     total_projects = serializers.IntegerField(source='total_projects_brought', read_only=True)
#     total_published_projects = serializers.SerializerMethodField(read_only=True)
#     total_rejected_projects = serializers.SerializerMethodField(read_only=True)
#     total_votes = serializers.IntegerField(source='total_votes_generated', read_only=True)
#     total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2, source='total_revenue_generated', read_only=True)
#     commission_earned = serializers.SerializerMethodField(read_only=True)

#     class Meta:
#         model = Commercial
#         fields = [
#             'id', 'full_name', 'phone', 'commission_rate',
#             'affiliate_link', 'is_active', 'created_at',
#             'user_email', 'user_full_name', 'user_phone', 'user_is_active',
#             'total_projects', 'total_published_projects', 'total_rejected_projects',
#             'total_votes', 'total_revenue', 'commission_earned'
#         ]
#         read_only_fields = ['affiliate_link', 'created_at']

#     def get_total_published_projects(self, obj):
#         return obj.total_published_projects()

#     def get_total_rejected_projects(self, obj):
#         return obj.total_rejected_projects()

#     def get_commission_earned(self, obj):
#         return float(obj.commission_earned())

#     def validate_phone(self, value):
#         if value and not re.match(r'^\d{7,15}$', value):
#             raise serializers.ValidationError(_("Le numéro de téléphone doit contenir entre 7 et 15 chiffres."))
#         return value

#     def validate_commission_rate(self, value):
#         if value < 0 or value > 100:
#             raise serializers.ValidationError(_("Le taux de commission doit être compris entre 0 et 100%."))
#         return value

#     def update(self, instance, validated_data):
#         # Séparer les données User des données Commercial
#         user_data = {}
#         if 'user' in validated_data:
#             user_data = validated_data.pop('user')
        
#         # Mettre à jour les données utilisateur
#         if user_data:
#             user = instance.user
#             for attr, value in user_data.items():
#                 setattr(user, attr, value)
#             user.save()
        
#         # Mettre à jour les données commercial
#         return super().update(instance, validated_data)


# class AdminUserListSerializer(serializers.ModelSerializer):
#     """Serializer pour lister tous les admins et commerciaux"""
#     commercial_info = serializers.SerializerMethodField()
    
#     class Meta:
#         model = User
#         fields = [
#             'id', 'username', 'email', 'full_name', 'phone', 'user_type',
#             'is_active', 'date_joined', 'last_login', 'commercial_info'
#         ]

#     def get_commercial_info(self, obj):
#         if obj.user_type == 'commercial':
#             try:
#                 commercial = Commercial.objects.get(user=obj)
#                 return {
#                     'commercial_id': commercial.id,
#                     'commission_rate': float(commercial.commission_rate),
#                     'total_projects': commercial.total_projects_brought(),
#                     'is_active': commercial.is_active
#                 }
#             except Commercial.DoesNotExist:
#                 return None
#         return None


class CommercialStatsSerializer(serializers.ModelSerializer):
    projects_brought = serializers.IntegerField()
    total_votes = serializers.IntegerField()
    
    class Meta:
        model = Commercial
        fields = ['full_name', 'projects_brought', 'total_votes', 'affiliate_link']
    