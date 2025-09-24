from commercial.serializers import CommercialSerializer
from projectowner.serializers import OwnerSerializer
from rest_framework import serializers
from .models import PAYMENT_STATUS, Project, Category, User, Vote, VotePayment, VotePriceSettings

from projectowner.models import Owner
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.core.validators import EmailValidator
from django.utils import timezone
import uuid
import re
from django.core.validators import RegexValidator
import json


# class CategoryAdminSerializer(serializers.ModelSerializer):
#     project_count = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Category
#         fields = ['id', 'category_id', 'category_name', 'image', 'active', 'slug', 'project_count', 'created_at']
#         read_only_fields = ['id', 'slug', 'category_id', 'project_count', 'created_at']
    
#     def get_project_count(self, obj):
#         return obj.project_count()
    
#     def validate_category_name(self, value):
#         # Vérifier l'unicité (en excluant l'instance actuelle pour la modification)
#         queryset = Category.objects.filter(category_name__iexact=value)
#         if self.instance:
#             queryset = queryset.exclude(pk=self.instance.pk)
        
#         if queryset.exists():
#             raise serializers.ValidationError("Une catégorie avec ce nom existe déjà.")
#         return value

class CategoryAdminSerializer(serializers.ModelSerializer):
    project_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'category_id', 'category_name', 'image', 'active', 'slug', 'project_count', 'created_at']
        read_only_fields = ['id', 'category_id', 'slug', 'project_count', 'created_at']
    
    def get_project_count(self, obj):
        return obj.project_count()
    
    def validate_category_name(self, value):
        # Normaliser le nom de la catégorie
        value = value.strip().capitalize()
        # Vérifier l'unicité (en excluant l'instance actuelle pour les mises à jour)
        queryset = Category.objects.filter(category_name__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise serializers.ValidationError("Une catégorie avec ce nom existe déjà.")
        return value

class ProjectAdminSerializer(serializers.ModelSerializer):
    """Serializer complet pour l'administration des projets"""
    owner_name = serializers.CharField(source='owner.user.full_name', read_only=True)
    owner_email = serializers.CharField(source='owner.user.email', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    commercial_name = serializers.CharField(source='commercial.user.full_name', read_only=True, allow_null=True)
    category_id = serializers.CharField(source='category.category_id', read_only=True,)
    
    # Statistiques calculées
    total_votes = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    total_revenue = serializers.SerializerMethodField()
    active_votes_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'project_id', 'slug', 'project_title', 'description',
            'local_area_impact', 'main_objective', 'solution',
            'estimated_budget', 'target_audience', 'progress_report',
            'platform_status', 'owner_project_status', 'featured',
            'created_at', 'updated_at', 'validated_at', 'admin_comment',
            # Relations
            'category', 'category_id', 'category_name', 'owner', 'owner_name', 'owner_email',
            'commercial', 'commercial_name',
            # Fichiers
            'file', 'image',
            # Statistiques
            'total_votes', 'average_rating', 'total_revenue', 'active_votes_count'
        ]
        read_only_fields = ['project_id', 'slug', 'created_at', 'updated_at', 'owner']

    def get_total_votes(self, obj):
        return obj.vote_set.filter(active=True).count()

    def get_average_rating(self, obj):
        return obj.average_rating()

    def get_total_revenue(self, obj):
        return float(obj.total_votes_revenue())

    def get_active_votes_count(self, obj):
        return obj.vote_count()

    def validate_platform_status(self, value):
        """Validation du statut avec gestion de la date de validation"""
        if value == 'publie' and not self.instance.validated_at:
            # sera géré dans la méthode update
            pass
        return value

    def update(self, instance, validated_data):
        # Gérer la validation automatique
        if (validated_data.get('platform_status') == 'publie' and 
            instance.platform_status != 'publie' and not instance.validated_at):
            validated_data['validated_at'] = timezone.now()
        
        return super().update(instance, validated_data)


class PublicProjectSerializer(serializers.ModelSerializer):
    """Affichage public des projets"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    owner_name = serializers.CharField(source='owner.user.full_name', read_only=True)
    
    # Statistiques des votes
    average_rating = serializers.SerializerMethodField()
    total_votes = serializers.SerializerMethodField()
    vote_count = serializers.SerializerMethodField()
    total_revenue = serializers.SerializerMethodField()
    
    # URL de l'image optimisée
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'project_id', 'slug', 'project_title', 'description',
            'local_area_impact', 'main_objective', 'solution',
            'estimated_budget', 'target_audience', 'progress_report',
            'featured', 'created_at', 'validated_at',
            # Relations
            'category_name', 'owner_name',
            # Fichiers
            'image', 'image_url', 'file',
            # Statistiques
            'average_rating', 'total_votes', 'vote_count', 'total_revenue'
        ]

    def get_average_rating(self, obj):
        return obj.average_rating()

    def get_total_votes(self, obj):
        return obj.vote_set.filter(active=True).count()

    def get_vote_count(self, obj):
        return obj.vote_count()

    def get_total_revenue(self, obj):
        return float(obj.total_votes_revenue())

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class PublicProjectListSerializer(serializers.ModelSerializer):
    """Serializer léger pour la liste des projets (sans tous les détails)"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    owner_name = serializers.CharField(source='owner.user.full_name', read_only=True)
    owner_image = serializers.CharField(source='owner.image', read_only=True)
    average_rating = serializers.SerializerMethodField()
    total_votes = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'project_id', 'slug', 'project_title', 'description',
            'estimated_budget', 'featured', 'created_at', 'validated_at',
            'category_name', 'owner_name', 'owner_image', 'image', 'image_url',
            'average_rating', 'total_votes'
        ]

    def get_average_rating(self, obj):
        return obj.average_rating()

    def get_total_votes(self, obj):
        return obj.vote_set.filter(active=True).count()

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class ProjectAnalyticsVoteSerializer(serializers.ModelSerializer):
    """Serializer pour les votes dans les analytics"""
    user_display = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    total_paid = serializers.SerializerMethodField()

    class Meta:
        model = Vote
        fields = [
            'id', 'vote', 'vote_count', 'phone', 'country_code',
            'created_at', 'user_display', 'payment_status', 'total_paid'
        ]

    def get_user_display(self, obj):
        if obj.user and obj.user.is_active:
            return obj.user.get_full_name() or obj.user.username
        return f"Téléphone: {obj.country_code}{obj.phone}"

    def get_payment_status(self, obj):
        try:
            payment = VotePayment.objects.get(vote=obj)
            return payment.status
        except VotePayment.DoesNotExist:
            return 'non_paye'

    def get_total_paid(self, obj):
        try:
            payment = VotePayment.objects.get(vote=obj)
            return float(payment.amount)
        except VotePayment.DoesNotExist:
            return 0.0
        
        
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
        return obj.vote[:100] + "..." if len(obj.vote) > 100 else obj.vote


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
        
        
    def to_internal_value(self, data):
        print(f"🔍 DEBUG ProjectSerializer - Type de data reçu: {type(data)}")
        print(f"🔍 DEBUG ProjectSerializer - Data: {data}")
        print(f"🔍 DEBUG ProjectSerializer - Fichiers image/file: {data.get('image')} / {data.get('file')}")

        
        # Si data est un string (venant de FormData), le parser
        # if isinstance(data, str):
        #     print("🔍 DEBUG ProjectSerializer - Parsing JSON string")
        #     try:
        #         data = json.loads(data)
        #         print("✅ DEBUG ProjectSerializer - JSON parsé avec succès")
        #     except json.JSONDecodeError as e:
        #         print(f"❌ DEBUG ProjectSerializer - Erreur JSON: {str(e)}")
        #         raise serializers.ValidationError({
        #             "error": {
        #                 "project": [f"Format JSON invalide pour le projet: {str(e)}"]
        #             }
        #         })
        
        try:
            result = super().to_internal_value(data)
            print("✅ DEBUG ProjectSerializer - to_internal_value réussi")
            return result
        except serializers.ValidationError as e:
            print(f"❌ DEBUG ProjectSerializer - Erreurs de validation: {e.detail}")
            # Reformater les erreurs pour une meilleure lisibilité
            formatted_errors = {}
            for field, messages in e.detail.items():
                if isinstance(messages, list):
                    formatted_errors[field] = messages[0] if messages else "Erreur de validation"
                else:
                    formatted_errors[field] = str(messages)
            
            raise serializers.ValidationError({
                "error": {
                    "project": formatted_errors
                }
            })


    def validate(self, attrs):
        # Valider category_id (ShortUUIDField)
        
        print(f"🔍 DEBUG ProjectSerializer.validate - Attrs reçus: {attrs}")
        category_id = attrs.get('category_id')
        if not category_id:
            print("❌ DEBUG - Category_id manquant")
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
            print(f"❌ DEBUG - Catégorie non trouvée: {category_id}")
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
                print(f"❌ DEBUG - Type utilisateur incorrect: {user.user_type}")
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
                print("✅ DEBUG - Owner validé")
            except Owner.DoesNotExist:
                print("❌ DEBUG - Profil Owner non trouvé")
                raise serializers.ValidationError({
                    "error": {
                        "non_field_errors": [_("Aucun profil Owner associé à cet utilisateur.")]
                    }
                })
                
        print("✅ DEBUG ProjectSerializer.validate - Validation terminée")
        return attrs
    
    # def to_internal_value(self, data):
    #     try:
    #         return super().to_internal_value(data)
    #     except serializers.ValidationError as e:
    #         errors = {}
    #         for field, messages in e.detail.items():
    #             # On prend le premier message si plusieurs
    #             custom_message = messages[0]
    #             errors.setdefault("error", {}).setdefault("project", {})[field] = custom_message
    #         raise serializers.ValidationError(errors)
    
    # def to_internal_value(self, data):
    #     # Si data est un string (venant de FormData), le parser
    #     if isinstance(data, str):
    #         import json
    #         try:
    #             data = json.loads(data)
    #         except json.JSONDecodeError:
    #             raise serializers.ValidationError("Format JSON invalide pour le projet")
        
    #     return super().to_internal_value(data)

    def create(self, validated_data):
        print("🔍 DEBUG ProjectSerializer.create - Début création")
        # Retirer category_id après validation pour éviter un conflit avec le champ category
        validated_data.pop('category_id', None)
        print(f"🔍 DEBUG - Données validées pour création: {list(validated_data.keys())}")
        project = super().create(validated_data)
        if not project.slug:
            project.slug = slugify(f"{project.project_title}-{project.project_id}")
            project.save()
            
        print(f"✅ DEBUG - Projet créé avec ID: {project.project_id}")

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
    
    def __init__(self, *args, **kwargs):
        super(ProjectCreateUpdateSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3
    

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
            'estimated_budget', 'target_audience', 'solution', 'progress_report', 'platform_status', 'owner_project_status',
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
        
        # Vérifier si request existe dans le contexte avant de l'utiliser
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            if user.user_type == 'owner':
                representation.pop('commercial', None)
            if not (user.is_staff or user.user_type == 'admin'):
                representation.pop('admin_comment', None)
        else:
            # Si pas de request dans le contexte, on peut soit:
            # 1. Retourner toutes les données (pour admin par défaut)
            # 2. Ou appliquer une logique par défaut
            representation.pop('admin_comment', None)  # Masquer par défaut
            
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
    


# class VoteSerializer(serializers.ModelSerializer):
#     phone = serializers.CharField(
#         max_length=20,
#         required=True,
#         validators=[RegexValidator(r'^\d{7,15}$', message=_("Le numéro de téléphone doit contenir entre 7 et 15 chiffres."))]
#     )
#     country_code = serializers.CharField(
#         max_length=5,
#         required=True,
#         validators=[RegexValidator(r'^\+\d{1,3}$', message=_("Le code pays doit être au format + suivi de 1 à 3 chiffres (ex. +33)."))]
#     )
#     project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source='project')
#     vote_count = serializers.IntegerField(write_only=True)  # Nombre de votes achetés

#     class Meta:
#         model = Vote
#         fields = ['id', 'project_id', 'vote', 'vote_count', 'phone', 'country_code', 'created_at', 'updated_at']
#         read_only_fields = ['created_at', 'updated_at']

#     def validate(self, attrs):
#         request = self.context.get('request')
#         project = attrs.get('project')
#         vote_count = attrs.get('vote_count')

#         # Vérifier si le projet est en statut "publie"
#         if project.platform_status != 'publie':
#             raise serializers.ValidationError({"project": _("Ce projet n'est pas ouvert aux votes.")})

#         # Vérifier si le vote_count est valide (existe dans VotePrice)
#         if not VotePrice.objects.filter(vote_count=vote_count, active=True).exists():
#             raise serializers.ValidationError({"vote_count": _("Nombre de votes invalide ou non disponible.")})

#         # Si l'utilisateur est authentifié
#         if request.user.is_authenticated:
#             attrs['user'] = request.user
#         else:
#             # Chercher un utilisateur existant avec le numéro de téléphone
#             phone = attrs['phone']
#             country_code = attrs['country_code']
#             full_phone = f"{country_code}{phone}"
#             try:
#                 user = User.objects.get(phone=full_phone)
#                 attrs['user'] = user
#             except User.DoesNotExist:
#                 # Créer un utilisateur temporaire
#                 username = f"voter_{phone}_{uuid.uuid4().hex[:8]}"
#                 user = User.objects.create(
#                     username=username,
#                     email=f"{username}@temp.com",
#                     phone=full_phone,
#                     full_name=phone,
#                     user_type='user',
#                     is_active=False
#                 )
#                 attrs['user'] = user

#         return attrs

#     def create(self, validated_data):
#         vote_count = validated_data.pop('vote_count')
#         phone = validated_data.pop('phone')
#         country_code = validated_data.pop('country_code')

#         # Créer le vote, non actif jusqu'au paiement
#         vote = Vote.objects.create(
#             **validated_data,
#             active=False,
#             vote_count=vote_count,
#             phone=phone,
#             country_code=country_code
#         )

#         return vote

#     def to_representation(self, instance):
#         # Ajouter le prix dans la réponse
#         representation = super().to_representation(instance)
#         try:
#             vote_price = VotePrice.objects.get(vote_count=instance.vote_count, active=True)
#             representation['price'] = vote_price.price
#         except VotePrice.DoesNotExist:
#             representation['price'] = None
#         return representation
    

# class VotePriceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = VotePrice
#         fields = ['id', 'vote_count', 'price', 'active', 'created_at']
#         read_only_fields = ['created_at']

#     def validate_vote_count(self, value):
#         if value < 1:
#             raise serializers.ValidationError(_("Le nombre de votes doit être supérieur ou égal à 1."))
#         if self.instance is None and VotePrice.objects.filter(vote_count=value, active=True).exists():
#             raise serializers.ValidationError(_("Un prix est déjà défini pour ce nombre de votes."))
#         return value

#     def validate_price(self, value):
#         if value <= 0:
#             raise serializers.ValidationError(_("Le prix doit être supérieur à 0."))
#         return value
    
    
# class VotePaymentSerializer(serializers.ModelSerializer):
#     vote_id = serializers.PrimaryKeyRelatedField(queryset=Vote.objects.all(), source='vote')
#     payment_method_id = serializers.CharField(write_only=True, required=True)

#     class Meta:
#         model = VotePayment
#         fields = ['id', 'vote_id', 'amount', 'status', 'payment_method', 'transaction_id', 'created_at', 'paid_at', 'payment_method_id']
#         read_only_fields = ['amount', 'status', 'transaction_id', 'created_at', 'paid_at']

#     def validate(self, attrs):
#         vote = attrs.get('vote')
#         vote_count = vote.vote_count

#         # Vérifier si le vote est déjà payé
#         if VotePayment.objects.filter(vote=vote).exists():
#             raise serializers.ValidationError({"vote": _("Ce vote a déjà été payé.")})

#         # Vérifier si le vote est valide (non actif, car en attente de paiement)
#         if vote.active:
#             raise serializers.ValidationError({"vote": _("Ce vote est déjà actif.")})

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
#             payment_method='orange_money'  # À ajuster selon votre système
#         )

#         # Simuler un paiement réussi (à remplacer par une intégration réelle)
#         payment.status = 'paye'
#         payment.paid_at = timezone.now()
#         payment.transaction_id = f"TXN_{uuid.uuid4().hex[:10].upper()}"
#         payment.save()

#         # Activer le vote après paiement
#         vote.active = True
#         vote.save()

#         return payment
    
# class VoteAndPaymentSerializer(serializers.ModelSerializer):
#     """Serializer pour créer un vote et son paiement en une seule fois"""
#     phone = serializers.CharField(
#         max_length=20,
#         required=True,
#         validators=[RegexValidator(r'^\d{7,15}$', message=_("Le numéro de téléphone doit contenir entre 7 et 15 chiffres."))]
#     )
#     country_code = serializers.CharField(
#         max_length=5,
#         required=True,
#         validators=[RegexValidator(r'^\+\d{1,3}$', message=_("Le code pays doit être au format + suivi de 1 à 3 chiffres (ex. +33)."))]
#     )
#     project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source='project', write_only=True)
#     vote_count = serializers.IntegerField(min_value=1, write_only=True)
#     payment_method_id = serializers.CharField(write_only=True, required=True, help_text="ID de la méthode de paiement (Orange Money, etc.)")
    
#     # NOUVEAUX CHAMPS OBLIGATOIRES
#     voter_name = serializers.CharField(max_length=100, required=True, help_text="Nom complet du votant")
#     voter_email = serializers.EmailField(required=True, help_text="Email du votant")
#     payment_reference = serializers.CharField(max_length=50, required=True, help_text="Référence de paiement fournie par le votant")
    
#     # Champs de lecture
#     total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
#     payment_status = serializers.CharField(read_only=True)
#     transaction_id = serializers.CharField(read_only=True)

#     class Meta:
#         model = Vote
#         fields = [
#             'id', 'project_id', 'vote', 'vote_count', 'phone', 'country_code', 
#             'voter_name', 'voter_email', 'payment_reference',
#             'payment_method_id', 'total_price', 'payment_status', 'transaction_id',
#             'created_at', 'updated_at'
#         ]
#         read_only_fields = ['created_at', 'updated_at']
        
#     def validate_voter_email(self, value):
#         """Valider que l'email est dans un format correct"""
#         if not value:
#             raise serializers.ValidationError(_("L'email du votant est obligatoire."))
#         return value.lower()

#     def validate_voter_name(self, value):
#         """Valider le nom du votant"""
#         if not value or len(value.strip()) < 2:
#             raise serializers.ValidationError(_("Le nom du votant doit contenir au moins 2 caractères."))
#         return value.strip()

#     def validate_payment_reference(self, value):
#         """Valider la référence de paiement"""
#         if not value or len(value.strip()) < 3:
#             raise serializers.ValidationError(_("La référence de paiement doit contenir au moins 3 caractères."))
        
#         # Vérifier l'unicité de la référence (optionnel)
#         if Vote.objects.filter(payment_reference=value).exists():
#             raise serializers.ValidationError(_("Cette référence de paiement a déjà été utilisée."))
        
#         return value.strip()

#     def validate(self, attrs):
#         request = self.context.get('request')
#         project = attrs.get('project')
#         vote_count = attrs.get('vote_count', 1)

#         # Vérifier si le projet est en statut "publie"
#         if project.platform_status != 'publie':
#             raise serializers.ValidationError({"project_id": _("Ce projet n'est pas ouvert aux votes.")})

#          # Gestion des utilisateurs
#         voter_email = attrs.get('voter_email')
#         voter_name = attrs.get('voter_name')
#         phone = attrs.get('phone')
#         country_code = attrs.get('country_code')
        
#         # Si l'utilisateur est authentifié
#         if request.user.is_authenticated:
#             attrs['user'] = request.user
#         else:
#             # Chercher un utilisateur existant avec l'email
#             try:
#                 user = User.objects.get(email=voter_email)
#                 attrs['user'] = user
#             except User.DoesNotExist:
#                 # Créer un utilisateur avec les nouvelles informations
#                 full_phone = f"{country_code}{phone}"
#                 username = f"voter_{phone}_{uuid.uuid4().hex[:8]}"
                
#                 user = User.objects.create(
#                     username=username,
#                     email=voter_email,
#                     phone=full_phone,
#                     full_name=voter_name,
#                     user_type='user',
#                     is_active=True  # Activé car on a plus d'infos
#                 )
#                 attrs['user'] = user

#         return attrs

#     def create(self, validated_data):
#         payment_method_id = validated_data.pop('payment_method_id')
#         phone = validated_data.pop('phone')
#         country_code = validated_data.pop('country_code')
#         vote_count = validated_data.pop('vote_count', 1)
#         voter_name = validated_data.pop('voter_name')
#         voter_email = validated_data.pop('voter_email')
#         payment_reference = validated_data.pop('payment_reference')

#         # Créer le vote, non actif jusqu'au paiement
#         vote = Vote.objects.create(
#             **validated_data,
#             active=False,
#             vote_count=vote_count,
#             phone=phone,
#             country_code=country_code,
#             voter_name=voter_name,
#             voter_email=voter_email,
#             payment_reference=payment_reference
#         )

#         # Calculer le montant total
#         vote_price = VotePriceSettings.get_vote_price()
#         total_amount = vote_price * vote_count

#         # Créer le paiement
#         payment = VotePayment.objects.create(
#             user=vote.user,
#             vote=vote,
#             amount=total_amount,
#             status='pending',
#             payment_method='orange_money'  # À ajuster selon votre système
#         )

#         # Simuler le processus de paiement
#         # Dans un vrai système, vous intégreriez ici l'API de paiement
#         try:
#             # Simuler un paiement réussi (remplacer par une vraie intégration)
#             payment.status = 'approved'
#             payment.paid_at = timezone.now()
#             payment.transaction_id = f"TXN_{uuid.uuid4().hex[:10].upper()}"
#             payment.save()

#             # Activer le vote après paiement réussi
#             vote.active = True
#             vote.save()

#         except Exception as e:
#             # En cas d'échec du paiement
#             payment.status = 'cancel'
#             payment.save()
#             raise serializers.ValidationError({
#                 "payment": _("Erreur lors du traitement du paiement.")
#             })

#         return vote

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
        
#         # Ajouter les informations de paiement
#         try:
#             payment = VotePayment.objects.get(vote=instance)
#             representation['total_price'] = payment.amount
#             representation['payment_status'] = payment.status
#             representation['transaction_id'] = payment.transaction_id
#         except VotePayment.DoesNotExist:
#             representation['total_price'] = instance.total_price
#             representation['payment_status'] = None
#             representation['transaction_id'] = None

#         # Ajouter les informations du projet
#         representation['project_title'] = instance.project.project_title
#         representation['project_slug'] = instance.project.slug

#         return representation


class VoteAndPaymentSerializer(serializers.ModelSerializer):
    """Serializer pour créer un vote avec les informations de paiement"""
    phone = serializers.CharField(
        max_length=20,
        required=True,
        # validators=[RegexValidator(r'^\d{7,15}$', message=_("Le numéro de téléphone doit être au format +XXXXXXX avec le code pays."))]
    )
    # country_code = serializers.CharField(
    #     max_length=5,
    #     required=True,
    #     validators=[RegexValidator(r'^\+\d{1,3}$', message=_("Le code pays doit être au format + suivi de 1 à 3 chiffres (ex. +33)."))]
    # )
    # project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source='project', write_only=True)
    project_id = serializers.CharField(write_only=True, help_text="ID string du projet")
    vote_count = serializers.IntegerField(min_value=1, write_only=True)
    
    # Informations du votant
    voter_name = serializers.CharField(max_length=100, required=True, help_text="Nom complet du votant")
    voter_email = serializers.EmailField(required=True, help_text="Email du votant")
    payment_reference = serializers.CharField(max_length=50, required=True, help_text="Référence de paiement")
    
    # Informations de paiement envoyées par le frontend
    payment_method = serializers.CharField(max_length=50, required=True, help_text="Méthode de paiement utilisée")
    payment_status = serializers.ChoiceField(
        choices=PAYMENT_STATUS, 
        required=True, 
        help_text="Statut du paiement retourné par l'API externe"
    )
    external_transaction_id = serializers.CharField(
        max_length=100, 
        required=False, 
        allow_blank=True,
        help_text="ID de transaction de l'API externe"
    )
    
    # Champs de lecture seulement
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    internal_transaction_id = serializers.CharField(read_only=True)

    class Meta:
        model = Vote
        fields = [
            'id', 'project_id', 'vote', 'vote_count', 'phone', 'country_code', 
            'voter_name', 'voter_email', 'payment_reference',
            'payment_method', 'payment_status', 'external_transaction_id',
            'total_price', 'internal_transaction_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
        
    
    def validate_phone(self, value):
        """Valider le numéro de téléphone avec code pays inclus"""
        if not value.startswith('+'):
            raise serializers.ValidationError(_("Le numéro de téléphone doit commencer par + (ex: +2290155662555)."))
        if len(value) < 8 or len(value) > 20:
            raise serializers.ValidationError(_("Le numéro de téléphone doit contenir entre 8 et 20 caractères."))
        return value

    def validate_project_id(self, value):
        """Valider que le project_id string correspond à un projet existant"""
        try:
            project = Project.objects.get(project_id=value)
            return project  # Retourner l'objet projet pour l'utiliser dans create()
        except Project.DoesNotExist:
            raise serializers.ValidationError(_("Aucun projet trouvé avec cet ID."))
        

    def validate_voter_email(self, value):
        if not value:
            raise serializers.ValidationError(_("L'email du votant est obligatoire."))
        return value.lower()

    def validate_voter_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError(_("Le nom du votant doit contenir au moins 2 caractères."))
        return value.strip()

    def validate_payment_reference(self, value):
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError(_("La référence de paiement doit contenir au moins 3 caractères."))
        
        # Vérifier l'unicité de la référence
        if Vote.objects.filter(payment_reference=value).exists():
            raise serializers.ValidationError(_("Cette référence de paiement a déjà été utilisée."))
        
        return value.strip()

    def validate_payment_status(self, value):
        """Valider le statut de paiement envoyé par le frontend"""
        if value not in ['approved', 'pending', 'declined', 'cancel']:
            raise serializers.ValidationError(_("Statut de paiement invalide."))
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        # project = attrs.get('project')
        project = attrs.get('project_id')  # Maintenant c'est l'objet Project grâce à validate_project_id
        payment_status = attrs.get('payment_status')

        # Vérifier si le projet est ouvert aux votes
        if project.platform_status != 'publie':
            raise serializers.ValidationError({"project_id": _("Ce projet n'est pas ouvert aux votes.")})

        # Validation logique : si le paiement est approuvé, l'external_transaction_id devrait être fourni
        if payment_status == 'approved' and not attrs.get('external_transaction_id'):
            raise serializers.ValidationError({
                "external_transaction_id": _("L'ID de transaction externe est requis pour un paiement approuvé.")
            })

        # Gestion des utilisateurs
        voter_email = attrs.get('voter_email')
        voter_name = attrs.get('voter_name')
        phone = attrs.get('phone')
        # country_code = attrs.get('country_code')
        
        if request.user.is_authenticated:
            attrs['user'] = request.user
        else:
            # Chercher ou créer un utilisateur avec l'email
            try:
                user = User.objects.get(email=voter_email)
                attrs['user'] = user
            except User.DoesNotExist:
                # full_phone = f"{phone}"
                # username = f"voter_{phone}_{uuid.uuid4().hex[:8]}"
                username = f"voter_{phone.replace('+', '')}_{uuid.uuid4().hex[:8]}"
                
                user = User.objects.create(
                    username=username,
                    email=voter_email,
                    phone=phone,
                    full_name=voter_name,
                    user_type='user',
                    is_active=True
                )
                attrs['user'] = user

        return attrs

    def create(self, validated_data):
        # Extraire les données de paiement
        payment_method = validated_data.pop('payment_method')
        payment_status = validated_data.pop('payment_status')
        external_transaction_id = validated_data.pop('external_transaction_id', '')
        
        # Extraire les autres données
        phone = validated_data.pop('phone')
        # country_code = validated_data.pop('country_code')
        vote_count = validated_data.pop('vote_count', 1)
        voter_name = validated_data.pop('voter_name')
        voter_email = validated_data.pop('voter_email')
        payment_reference = validated_data.pop('payment_reference')
        project = validated_data.pop('project_id')  # C'est maintenant l'objet Project

        # Calculer le montant total
        vote_price = VotePriceSettings.get_vote_price()
        total_amount = vote_price * vote_count

        # Créer le vote avec le statut basé sur le paiement
        vote_active = payment_status == 'approved'
        
        vote = Vote.objects.create(
            **validated_data,
            project=project,
            active=vote_active,
            vote_count=vote_count,
            phone=phone,
            # country_code=country_code,
            voter_name=voter_name,
            voter_email=voter_email,
            payment_reference=payment_reference
        )

        # Générer un ID de transaction interne
        internal_transaction_id = f"TXN_{uuid.uuid4().hex[:10].upper()}"

        # Créer l'enregistrement de paiement
        payment = VotePayment.objects.create(
            user=vote.user,
            vote=vote,
            amount=total_amount,
            status=payment_status,
            payment_method=payment_method,
            transaction_id=external_transaction_id or internal_transaction_id
        )

        # Si le paiement est approuvé, marquer comme payé
        if payment_status == 'approved':
            payment.paid_at = timezone.now()
            payment.save()

        return vote

    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
        
    #     # Ajouter les informations de paiement
    #     try:
    #         payment = VotePayment.objects.get(vote=instance)
    #         representation['total_price'] = payment.amount
    #         representation['payment_status'] = payment.status
    #         representation['internal_transaction_id'] = payment.transaction_id
    #     except VotePayment.DoesNotExist:
    #         representation['total_price'] = instance.total_price
    #         representation['payment_status'] = None
    #         representation['internal_transaction_id'] = None

    #     # Ajouter les informations du projet
    #     representation['project_title'] = instance.project.project_title
    #     representation['project_slug'] = instance.project.slug

    #     return representation
    
    def to_representation(self, instance):
        # Récupérer seulement les champs qui existent sur le modèle Vote
        data = {
            'id': instance.id,
            'vote': instance.vote,
            'vote_count': instance.vote_count,
            'phone': instance.phone,
            'voter_name': instance.voter_name,
            'voter_email': instance.voter_email,
            'payment_reference': instance.payment_reference,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at,
        }
        
        # Ajouter les informations de paiement depuis VotePayment
        try:
            payment = VotePayment.objects.get(vote=instance)
            data['total_price'] = str(payment.amount)
            data['payment_status'] = payment.status
            data['internal_transaction_id'] = payment.transaction_id
        except VotePayment.DoesNotExist:
            data['total_price'] = str(instance.total_price)
            data['payment_status'] = None
            data['internal_transaction_id'] = None

        # Ajouter les informations du projet
        data['project_title'] = instance.project.project_title
        data['project_slug'] = instance.project.slug
        
        return data


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
        return VoteAndPaymentSerializer(votes, many=True).data
    
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
    
    
class VotePriceSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VotePriceSettings
        fields = ['id', 'vote_price', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_vote_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(_("Le prix doit être supérieur à 0."))
        return value