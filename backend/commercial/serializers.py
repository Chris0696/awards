
from rest_framework import serializers
from project.models import AffiliateClick, Commercial
from django.utils.translation import gettext_lazy as _
import re
from userauths.models import User, USER_TYPES
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from django.core.validators import RegexValidator

from django.utils import timezone
from datetime import timedelta



class CommercialSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    total_projects = serializers.IntegerField(source='total_projects_brought', read_only=True)
    total_published_projects = serializers.IntegerField(read_only=True)
    total_rejected_projects = serializers.IntegerField(read_only=True)
    total_votes = serializers.IntegerField(source='total_votes_generated', read_only=True)
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2, source='total_revenue_generated', read_only=True)
    commission_earned = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    # Nombres de cliques obtenus
    total_clicks = serializers.IntegerField(read_only=True)
    click_rate = serializers.SerializerMethodField()
    clicks_last_30_days = serializers.SerializerMethodField()
    clicks_today = serializers.SerializerMethodField()
    
    class Meta:
        model = Commercial
        fields = [
            'id', 'user_email', 'full_name', 'phone', 'commission_rate', 'affiliate_link',
            'is_active', 'created_at', 'total_projects', 'total_published_projects',
            'total_rejected_projects', 'total_votes', 'total_revenue', 'commission_earned',
            'total_clicks',
            'click_rate', 'clicks_last_30_days', 'clicks_today'
        ]
        read_only_fields = ['affiliate_link', 'created_at']
        
    def get_click_rate(self, obj):
        return obj.get_click_rate()
    
    def get_clicks_last_30_days(self, obj):
        thirty_days_ago = timezone.now() - timedelta(days=30)
        return AffiliateClick.objects.filter(
            commercial=obj,
            clicked_at__gte=thirty_days_ago
        ).count()
    
    def get_clicks_today(self, obj):
        today = timezone.now().date()
        return AffiliateClick.objects.filter(
            commercial=obj,
            clicked_at__date=today
        ).count()
        

    def validate_phone(self, value):
        if value and not re.match(r'^\d{7,15}$', value):
            raise serializers.ValidationError(_("Le numéro de téléphone doit contenir entre 7 et 15 chiffres."))
        return value

    def validate_commission_rate(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(_("Le taux de commission doit être compris entre 0 et 100%."))
        return value


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
        # if not re.match(r'^\d{7,15}$', value):
        #     raise serializers.ValidationError(_("Le numéro de téléphone doit contenir entre 7 et 15 chiffres."))
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError(
             [_("Ce numéro de téléphone est déjà utilisé.")]
             )
         
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                [_("Cet email est déjà utilisé.")]
                
                )
            
        return value
    
    def validate_password(self, value):
        if User.objects.filter(password=value).exists():
            raise serializers.ValidationError(
                [_("Votre mot de passe doit contenir plus de 8 caractères (des chriffres et lettres compris).")]
                
                )
            
        return value
    
    def validate(self, attrs):
        # Autoriser les superusers ou les utilisateurs avec user_type='admin'
        request = self.context.get('request')
        if not request.user.is_authenticated or (request.user.user_type != 'admin' and not request.user.is_superuser):
            raise serializers.ValidationError([
                 _("Seul un administrateur ou un superuser peut créer un utilisateur de type admin ou commercial.")
            ])
        
        return attrs

    def validate_user_type(self, value):
        allowed_types = ['admin', 'commercial']
        if value not in allowed_types:
            raise serializers.ValidationError([_("Le type d'utilisateur doit être 'admin' ou 'commercial'.")])
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
            raise serializers.ValidationError([
                _("Erreur lors de la création de l'utilisateur: {}").format(str(e))
            ])
  

class CommercialDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour un Commercial avec ses filleuls"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    user_type = serializers.CharField(source='user.user_type', read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    
    # Statistiques
    total_projects = serializers.SerializerMethodField()
    total_published_projects = serializers.SerializerMethodField()
    total_rejected_projects = serializers.SerializerMethodField()
    total_votes = serializers.SerializerMethodField()
    total_revenue = serializers.SerializerMethodField()
    commission_earned = serializers.SerializerMethodField()
    
    # Filleuls (Owners affiliés)
    affiliates = serializers.SerializerMethodField()
    affiliates_count = serializers.SerializerMethodField()
    
    # Nombres de cliques obtenus
    total_clicks = serializers.IntegerField(read_only=True)
    click_rate = serializers.SerializerMethodField()
    clicks_last_30_days = serializers.SerializerMethodField()
    clicks_today = serializers.SerializerMethodField()
    
    class Meta:
        model = Commercial
        fields = [
            'id', 'user_id', 'user_email', 'user_type', 'full_name', 'phone',
            'commission_rate', 'affiliate_link', 'is_active', 'created_at',
            'total_projects', 'total_published_projects', 'total_rejected_projects',
            'total_votes', 'total_revenue', 'commission_earned',
            'affiliates', 'affiliates_count', 'total_clicks',
            'click_rate', 'clicks_last_30_days', 'clicks_today'
        ]
    
    def get_click_rate(self, obj):
        return obj.get_click_rate()
    
    def get_clicks_last_30_days(self, obj):
        thirty_days_ago = timezone.now() - timedelta(days=30)
        return AffiliateClick.objects.filter(
            commercial=obj,
            clicked_at__gte=thirty_days_ago
        ).count()
    
    def get_clicks_today(self, obj):
        today = timezone.now().date()
        return AffiliateClick.objects.filter(
            commercial=obj,
            clicked_at__date=today
        ).count()
        
    def get_total_projects(self, obj):
        return obj.total_projects_brought()
    
    def get_total_published_projects(self, obj):
        return obj.total_published_projects()
    
    def get_total_rejected_projects(self, obj):
        return obj.total_rejected_projects()
    
    def get_total_votes(self, obj):
        return obj.total_votes_generated()
    
    def get_total_revenue(self, obj):
        return str(obj.total_revenue_generated())
    
    def get_commission_earned(self, obj):
        return str(obj.commission_earned())
    
    def get_affiliates_count(self, obj):
        """Nombre de filleuls (Owners) affiliés à ce commercial"""
        from projectowner.models import Owner
        return Owner.objects.filter(commercial=obj).count()
    
    def get_affiliates(self, obj):
        """Liste des filleuls (Owners) affiliés à ce commercial"""
        from projectowner.serializers import OwnerListSerializer
        from projectowner.models import Owner
        owners = Owner.objects.filter(commercial=obj).select_related('user', 'profile')
        return OwnerListSerializer(owners, many=True, context=self.context).data


# class CommercialStatsSerializer(serializers.ModelSerializer):
#     projects_brought = serializers.IntegerField()
#     total_votes = serializers.IntegerField()
    
#     class Meta:
#         model = Commercial
#         fields = ['full_name', 'projects_brought', 'total_votes', 'affiliate_link']

class CommercialStatsSerializer(serializers.ModelSerializer):
    """Serializer avec statistiques de clics"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    total_clicks = serializers.IntegerField(read_only=True)
    click_rate = serializers.SerializerMethodField()
    clicks_last_30_days = serializers.SerializerMethodField()
    clicks_today = serializers.SerializerMethodField()
    
    class Meta:
        model = Commercial
        fields = [
            'id', 'user_email', 'full_name', 'affiliate_link',
            'total_clicks', 'click_rate', 'clicks_last_30_days', 'clicks_today'
        ]
    
    def get_click_rate(self, obj):
        return obj.get_click_rate()
    
    def get_clicks_last_30_days(self, obj):
        """Clics des 30 derniers jours"""
        
        thirty_days_ago = timezone.now() - timedelta(days=30)
        return AffiliateClick.objects.filter(
            commercial=obj,
            clicked_at__gte=thirty_days_ago
        ).count()
    
    def get_clicks_today(self, obj):
        """Clics d'aujourd'hui"""
        
        
        today = timezone.now().date()
        return AffiliateClick.objects.filter(
            commercial=obj,
            clicked_at__date=today
        ).count()


class AffiliateClickSerializer(serializers.Serializer):
    """Serializer pour enregistrer un clic d'affiliation"""
    affiliate_code = serializers.CharField(required=True)
    ip_address = serializers.IPAddressField(required=False, allow_null=True)
    user_agent = serializers.CharField(required=False, allow_blank=True)
    referrer = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    
    def validate_affiliate_code(self, value):
        """Valider que le code d'affiliation existe"""
        # Le code peut être "COM_3179B372" ou l'URL complète
        if 'affiliate=' in value:
            value = value.split('affiliate=')[-1]
        
        # Chercher le commercial par son code
        if not Commercial.objects.filter(affiliate_link__contains=value).exists():
            raise serializers.ValidationError(_("Code d'affiliation invalide"))
        
        return value