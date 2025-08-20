from rest_framework import serializers
from .models import Project, Category, Commercial, User, Vote, VotePayment, VotePrice
from projectowner.models import Owner
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.core.validators import EmailValidator
from django.utils import timezone
import uuid
import re
from django.core.validators import RegexValidator


class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category')
    owner_id = serializers.PrimaryKeyRelatedField(read_only=True, source='owner')
    commercial_id = serializers.PrimaryKeyRelatedField(queryset=Commercial.objects.all(), source='commercial', required=False, allow_null=True)

    class Meta:
        model = Project
        fields = [
            'id', 'category_id', 'owner_id', 'commercial_id', 'file', 'image', 'project_title',
            'local_area_impact', 'main_objective', 'solution', 'description', 'estimated_budget',
            'platform_status', 'owner_project_status', 'featured', 'project_id', 'created_at',
            'updated_at', 'admin_comment', 'slug'
        ]
        read_only_fields = ['owner_id', 'project_id', 'created_at', 'updated_at', 'slug', 'platform_status', 'validated_at']

    def validate(self, attrs):
        request = self.context.get('request')
        user = request.user

        # Vérifier que l'utilisateur est authentifié et de type 'owner'
        if not user.is_authenticated or user.user_type != 'owner':
            raise serializers.ValidationError({"error": _("Seul un utilisateur de type 'owner' peut soumettre un projet.")})

        # Assigner automatiquement l'owner à l'utilisateur authentifié
        try:
            owner = Owner.objects.get(user=user)
            attrs['owner'] = Owner.objects.get(user=user)
        except Owner.DoesNotExist:
            raise serializers.ValidationError({"error": _("Aucun profil Owner associé à cet utilisateur.")})
        
        # Si aucun commercial n'est spécifié, utiliser le commercial associé à l'owner
        if not attrs.get('commercial') and owner.commercial:
            attrs['commercial'] = owner.commercial

        return attrs

    def create(self, validated_data):
        # Générer le slug si non fourni
        project = Project.objects.create(**validated_data)
        if not project.slug:
            project.slug = slugify(f"{project.project_title}-{project.project_id}")
        project.save()
        return project
    

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
    vote_count = serializers.IntegerField(write_only=True)  # Nombre de points (2, 3, 5, etc.)

    class Meta:
        model = Vote
        fields = ['id', 'project_id', 'vote', 'vote_count', 'country_code', 'phone', 'created_at', 'updated_at']
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
                user = User.objects.get(phone=full_phone)  # Supposons un champ phone dans User (voir ci-dessous)
                attrs['user'] = user
            except User.DoesNotExist:
                # Créer un utilisateur temporaire
                username = f"voter_{phone}_{uuid.uuid4().hex[:8]}"
                user = User.objects.create(
                    username=username,
                    email=f"{username}@temp.com",  # Email fictif
                    phone=full_phone,
                    full_name=phone,
                    user_type='user',
                    is_active=False
                )
                attrs['user'] = user

        attrs['phone'] = phone
        attrs['country_code'] = country_code
        return attrs

    def create(self, validated_data):
        vote_count = validated_data.pop('vote_count')
        validated_data.pop('phone')  # Stocké dans le modèle Vote
        validated_data.pop('country_code')  # Stocké dans le modèle Vote

        # Créer le vote, mais le marquer comme non actif jusqu'au paiement
        vote = Vote.objects.create(**validated_data, active=False, vote_count=vote_count)

        # Récupérer le prix pour inclure dans la réponse
        vote_price = VotePrice.objects.get(vote_count=vote_count)
        vote.price = vote_price.price  # Ajouter le prix au vote si nécessaire
        vote.save()

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
    

class VotePaymentSerializer(serializers.ModelSerializer):
    vote_id = serializers.PrimaryKeyRelatedField(queryset=Vote.objects.all(), source='vote')
    payment_method_id = serializers.CharField(write_only=True, required=True)  # Pour Orange Money, par exemple

    class Meta:
        model = VotePayment
        fields = ['id', 'vote_id', 'amount', 'status', 'payment_method', 'transaction_id', 'created_at', 'paid_at', 'payment_method_id']
        read_only_fields = ['status', 'transaction_id', 'created_at', 'paid_at']

    def validate(self, attrs):
        vote = attrs.get('vote')
        vote_count = vote.vote_count

        # Vérifier si le vote est déjà payé
        if VotePayment.objects.filter(vote=vote).exists():
            raise serializers.ValidationError({"vote": _("Ce vote a déjà été payé.")})

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
            payment_method='orange_money'  # À ajuster selon le système de paiement
        )

        # Simuler un paiement réussi (à remplacer par une intégration réelle)
        payment.status = 'paye'
        payment.paid_at = timezone.now()
        payment.transaction_id = f"TXN_{uuid.uuid4().hex[:10].upper()}"
        payment.save()

        # Activer le vote après paiement réussi
        vote.active = True
        vote.save()

        return payment
    

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