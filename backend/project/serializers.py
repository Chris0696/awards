from commercial.serializers import CommercialSerializer
from projectowner.serializers import OwnerSerializer
from rest_framework import serializers
from .models import Project, Category, User, Vote, VotePayment, VotePrice

from projectowner.models import Owner
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.core.validators import EmailValidator
from django.utils import timezone
import uuid
import re
from django.core.validators import RegexValidator


class CategoryAdminSerializer(serializers.ModelSerializer):
    project_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'category_id', 'category_name', 'image', 'active', 'slug', 'project_count', 'created_at']
        read_only_fields = ['id', 'slug', 'category_id', 'project_count', 'created_at']
    
    def get_project_count(self, obj):
        return obj.project_count()
    
    def validate_category_name(self, value):
        # Vérifier l'unicité (en excluant l'instance actuelle pour la modification)
        queryset = Category.objects.filter(category_name__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise serializers.ValidationError("Une catégorie avec ce nom existe déjà.")
        return value
    

# Serializer simplifié pour lister les catégories actives (pour les utilisateurs)
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'category_name', 'image', 'slug']
        
    def to_representation(self, instance):
        # Ne retourner que les catégories actives
        if not instance.active:
            return None
        return super().to_representation(instance)



class CategoryStatsSerializer(serializers.ModelSerializer):
    project_count = serializers.IntegerField()
    
    class Meta:
        model = Category
        fields = ['category_name', 'project_count', 'slug']
        

class RecentProjectSerializer(serializers.ModelSerializer):
    votes = serializers.IntegerField(source='vote_count')
    rank = serializers.IntegerField()
    category = CategorySerializer(read_only=True)  # Inclut category_id
    
    class Meta:
        model = Project
        fields = ['project_id', 'project_title', 'platform_status', 'votes', 'rank', 'category', 'created_at']


class RecentVoteSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.project_title')
    user = serializers.CharField(source='user.full_name', allow_null=True, default='Anonyme')
    review = serializers.SerializerMethodField()
    
    class Meta:
        model = Vote
        fields = ['project_title', 'user', 'vote', 'review', 'created_at']
    
    def get_review(self, obj):
        return obj.review[:100] + "..." if len(obj.review) > 100 else obj.review


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    category_id = serializers.CharField(
        max_length=20,
        required=True,
        write_only=True,
        error_messages={
        "required": "Vous devez obligatoirement choisir une catégorie pour le projet.",
        "blank": "Le champ catégorie ne peut pas être vide.",
        "max_length": "L’identifiant de catégorie est trop long."
    }
    )
    owner_id = serializers.PrimaryKeyRelatedField(
        read_only=True,
        source='owner'
    )

    class Meta:
        model = Project
        fields = [
            'project_id', 'category_id', 'owner_id', 'file', 'image',
            'project_title', 'local_area_impact', 'main_objective', 'solution',
            'description', 'estimated_budget', 'target_audience', 'progress_report',
            'owner_project_status'
        ]
        read_only_fields = ['project_id', 'owner_id']

    def validate(self, attrs):
        # Valider category_id (ShortUUIDField)
        category_id = attrs.get('category_id')
        print("Validating attrs:", attrs)  # Débogage
        if not category_id:
            raise serializers.ValidationError({
                "error": {
                    "project" :{
                        "category_id": _("Vous devez obligatoirement choisir une catégorie pour le projet.")
                    }
                }
            })
        
        try:
            category = Category.objects.get(category_id=category_id, active=True)
            attrs['category'] = category
            print("Found category:", category.category_name)  # Débogage
        except Category.DoesNotExist:
            raise serializers.ValidationError({
                "error": {
                    "project" :{
                        "category_id": _("La catégorie sélectionnée n'existe pas ou n'est pas active.")
                    }
                }
                
            })

        # Ne pas retirer category_id ici pour éviter de perturber d'autres validations
        # attrs.pop('category_id', None)

        # Validation de l'owner
        request = self.context.get('request')
        skip_auth = self.context.get('skip_auth_validation', False)
        if not skip_auth and request and hasattr(request, 'user') and request.user.is_authenticated:
            user = request.user
            if user.user_type != 'owner':
                raise serializers.ValidationError({
                    "error": {
                        "non_field_errors": [_("Seul un utilisateur de type 'owner' peut créer ou modifier un projet.")]
                    }
                })
            try:
                owner = Owner.objects.get(user=user)
                attrs['owner'] = owner
                if owner.commercial:
                    attrs['commercial'] = owner.commercial
            except Owner.DoesNotExist:
                raise serializers.ValidationError({
                    "error": {
                        "non_field_errors": [_("Aucun profil Owner associé à cet utilisateur.")]
                    }
                })

        return attrs
    
    def to_internal_value(self, data):
        try:
            return super().to_internal_value(data)
        except serializers.ValidationError as e:
            errors = {}
            for field, messages in e.detail.items():
                # On prend le premier message si plusieurs
                custom_message = messages[0]
                errors.setdefault("error", {}).setdefault("project", {})[field] = custom_message
            raise serializers.ValidationError(errors)

    def create(self, validated_data):
        # Retirer category_id après validation pour éviter un conflit avec le champ category
        validated_data.pop('category_id', None)
        project = super().create(validated_data)
        if not project.slug:
            project.slug = slugify(f"{project.project_title}-{project.project_id}")
            project.save()
        return project

    def update(self, instance, validated_data):
        validated_data.pop('platform_status', None)
        validated_data.pop('admin_comment', None)
        validated_data.pop('category_id', None)  # Retirer category_id pour l'update
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.category:
            representation['category'] = CategorySerializer(instance.category).data
        return representation
    

class ProjectListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    owner = OwnerSerializer(read_only=True)
    commercial = CommercialSerializer(read_only=True)
    average_rating = serializers.SerializerMethodField()
    vote_count = serializers.SerializerMethodField()
    total_revenue = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'project_id', 'project_title', 'slug', 'description', 'image',
            'estimated_budget', 'platform_status', 'owner_project_status',
            'featured', 'created_at', 'updated_at', 'validated_at',
            'category', 'owner', 'commercial', 'average_rating', 
            'vote_count', 'total_revenue'
        ]

    def get_average_rating(self, obj):
        return obj.average_rating()
    
    def get_vote_count(self, obj):
        return obj.vote_count()
    
    def get_total_revenue(self, obj):
        return obj.total_votes_revenue()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user = self.context['request'].user
        if user.user_type == 'owner':
            representation.pop('commercial', None)
        if not (user.is_staff or user.user_type == 'admin'):
            representation.pop('admin_comment', None)
        return representation


class ProjectStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['platform_status', 'admin_comment']

    def validate_platform_status(self, value):
        valid_statuses = ['brouillon', 'desactive', 'rejete', 'publie']
        if value not in valid_statuses:
            raise serializers.ValidationError(_("Statut invalide. Les statuts valides sont : brouillon, désactivé, rejeté, publié."))
        return value
    

class ProjectDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    owner = OwnerSerializer(read_only=True)
    commercial = CommercialSerializer(read_only=True)
    votes = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    vote_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'project_id', 'project_title', 'slug', 'description', 'image',
            'local_area_impact', 'main_objective', 'solution', 'estimated_budget',
            'target_audience', 'progress_report', 'platform_status', 'owner_project_status',
            'featured', 'created_at', 'updated_at', 'validated_at', 'admin_comment',
            'category', 'owner', 'commercial', 'votes', 'average_rating', 'vote_count'
        ]

    def get_votes(self, obj):
        votes = obj.vote_set.filter(active=True).select_related('user')
        return VoteSerializer(votes, many=True).data
    
    def get_average_rating(self, obj):
        return obj.average_rating()
    
    def get_vote_count(self, obj):
        return obj.vote_count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user = self.context['request'].user
        if user.user_type == 'owner':
            representation.pop('commercial', None)
        if not (user.is_staff or user.user_type == 'admin'):
            representation.pop('admin_comment', None)
        return representation
    


class VoteSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(
        max_length=20,
        required=True,
        validators=[RegexValidator(r'^\d{7,15}$', message=_("Le numéro de téléphone doit contenir entre 7 et 15 chiffres."))]
    )
    country_code = serializers.CharField(
        max_length=5,
        required=True,
        validators=[RegexValidator(r'^\+\d{1,3}$', message=_("Le code pays doit être au format + suivi de 1 à 3 chiffres (ex. +33)."))]
    )
    project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source='project')
    vote_count = serializers.IntegerField(write_only=True)  # Nombre de votes achetés

    class Meta:
        model = Vote
        fields = ['id', 'project_id', 'vote', 'vote_count', 'phone', 'country_code', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, attrs):
        request = self.context.get('request')
        project = attrs.get('project')
        vote_count = attrs.get('vote_count')

        # Vérifier si le projet est en statut "publie"
        if project.platform_status != 'publie':
            raise serializers.ValidationError({"project": _("Ce projet n'est pas ouvert aux votes.")})

        # Vérifier si le vote_count est valide (existe dans VotePrice)
        if not VotePrice.objects.filter(vote_count=vote_count, active=True).exists():
            raise serializers.ValidationError({"vote_count": _("Nombre de votes invalide ou non disponible.")})

        # Si l'utilisateur est authentifié
        if request.user.is_authenticated:
            attrs['user'] = request.user
        else:
            # Chercher un utilisateur existant avec le numéro de téléphone
            phone = attrs['phone']
            country_code = attrs['country_code']
            full_phone = f"{country_code}{phone}"
            try:
                user = User.objects.get(phone=full_phone)
                attrs['user'] = user
            except User.DoesNotExist:
                # Créer un utilisateur temporaire
                username = f"voter_{phone}_{uuid.uuid4().hex[:8]}"
                user = User.objects.create(
                    username=username,
                    email=f"{username}@temp.com",
                    phone=full_phone,
                    full_name=phone,
                    user_type='user',
                    is_active=False
                )
                attrs['user'] = user

        return attrs

    def create(self, validated_data):
        vote_count = validated_data.pop('vote_count')
        phone = validated_data.pop('phone')
        country_code = validated_data.pop('country_code')

        # Créer le vote, non actif jusqu'au paiement
        vote = Vote.objects.create(
            **validated_data,
            active=False,
            vote_count=vote_count,
            phone=phone,
            country_code=country_code
        )

        return vote

    def to_representation(self, instance):
        # Ajouter le prix dans la réponse
        representation = super().to_representation(instance)
        try:
            vote_price = VotePrice.objects.get(vote_count=instance.vote_count, active=True)
            representation['price'] = vote_price.price
        except VotePrice.DoesNotExist:
            representation['price'] = None
        return representation
    

# class VotePaymentSerializer(serializers.ModelSerializer):
#     vote_id = serializers.PrimaryKeyRelatedField(queryset=Vote.objects.all(), source='vote')
#     payment_method_id = serializers.CharField(write_only=True, required=True)  # Pour Orange Money, par exemple

#     class Meta:
#         model = VotePayment
#         fields = ['id', 'vote_id', 'amount', 'status', 'payment_method', 'transaction_id', 'created_at', 'paid_at', 'payment_method_id']
#         read_only_fields = ['status', 'transaction_id', 'created_at', 'paid_at']

#     def validate(self, attrs):
#         vote = attrs.get('vote')
#         vote_count = vote.vote_count

#         # Vérifier si le vote est déjà payé
#         if VotePayment.objects.filter(vote=vote).exists():
#             raise serializers.ValidationError({"vote": _("Ce vote a déjà été payé.")})

#         # Récupérer le prix correspondant au vote_count
#         try:
#             vote_price = VotePrice.objects.get(vote_count=vote_count, active=True)
#             attrs['amount'] = vote_price.price
#         except VotePrice.DoesNotExist:
#             raise serializers.ValidationError({"vote_count": _("Aucun prix défini pour ce nombre de votes.")})

#         return attrs

#     def create(self, validated_data):
#         payment_method_id = validated_data.pop('payment_method_id')
#         vote = validated_data['vote']

#         # Créer le paiement
#         payment = VotePayment.objects.create(
#             user=vote.user,
#             vote=vote,
#             amount=validated_data['amount'],
#             status='en_attente',
#             payment_method='orange_money'  # À ajuster selon le système de paiement
#         )

#         # Simuler un paiement réussi (à remplacer par une intégration réelle)
#         payment.status = 'paye'
#         payment.paid_at = timezone.now()
#         payment.transaction_id = f"TXN_{uuid.uuid4().hex[:10].upper()}"
#         payment.save()

#         # Activer le vote après paiement réussi
#         vote.active = True
#         vote.save()

#         return payment


class VotePriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = VotePrice
        fields = ['id', 'vote_count', 'price', 'active', 'created_at']
        read_only_fields = ['created_at']

    def validate_vote_count(self, value):
        if value < 1:
            raise serializers.ValidationError(_("Le nombre de votes doit être supérieur ou égal à 1."))
        if self.instance is None and VotePrice.objects.filter(vote_count=value, active=True).exists():
            raise serializers.ValidationError(_("Un prix est déjà défini pour ce nombre de votes."))
        return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(_("Le prix doit être supérieur à 0."))
        return value
    
    
class VotePaymentSerializer(serializers.ModelSerializer):
    vote_id = serializers.PrimaryKeyRelatedField(queryset=Vote.objects.all(), source='vote')
    payment_method_id = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = VotePayment
        fields = ['id', 'vote_id', 'amount', 'status', 'payment_method', 'transaction_id', 'created_at', 'paid_at', 'payment_method_id']
        read_only_fields = ['amount', 'status', 'transaction_id', 'created_at', 'paid_at']

    def validate(self, attrs):
        vote = attrs.get('vote')
        vote_count = vote.vote_count

        # Vérifier si le vote est déjà payé
        if VotePayment.objects.filter(vote=vote).exists():
            raise serializers.ValidationError({"vote": _("Ce vote a déjà été payé.")})

        # Vérifier si le vote est valide (non actif, car en attente de paiement)
        if vote.active:
            raise serializers.ValidationError({"vote": _("Ce vote est déjà actif.")})

        # Récupérer le prix correspondant au vote_count
        try:
            vote_price = VotePrice.objects.get(vote_count=vote_count, active=True)
            attrs['amount'] = vote_price.price
        except VotePrice.DoesNotExist:
            raise serializers.ValidationError({"vote_count": _("Aucun prix défini pour ce nombre de votes.")})

        return attrs

    def create(self, validated_data):
        payment_method_id = validated_data.pop('payment_method_id')
        vote = validated_data['vote']

        # Créer le paiement
        payment = VotePayment.objects.create(
            user=vote.user,
            vote=vote,
            amount=validated_data['amount'],
            status='en_attente',
            payment_method='orange_money'  # À ajuster selon votre système
        )

        # Simuler un paiement réussi (à remplacer par une intégration réelle)
        payment.status = 'paye'
        payment.paid_at = timezone.now()
        payment.transaction_id = f"TXN_{uuid.uuid4().hex[:10].upper()}"
        payment.save()

        # Activer le vote après paiement
        vote.active = True
        vote.save()

        return payment
    
