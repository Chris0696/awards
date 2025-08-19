from rest_framework import serializers
from .models import Project, Category, Commercial, User, Vote, VotePayment, VotePrice
from projectowner.models import Owner
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.core.validators import EmailValidator
from django.utils import timezone
import uuid



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
            attrs['owner'] = Owner.objects.get(user=user)
        except Owner.DoesNotExist:
            raise serializers.ValidationError({"error": _("Aucun profil Owner associé à cet utilisateur.")})

        return attrs

    def create(self, validated_data):
        # Générer le slug si non fourni
        project = Project.objects.create(**validated_data)
        if not project.slug:
            project.slug = slugify(f"{project.project_title}-{project.project_id}")
        project.save()
        return project
    

class VoteSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False, write_only=True, validators=[EmailValidator()])
    project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source='project')
    vote_count = serializers.IntegerField(write_only=True)  # Nombre de points (2, 3, 5, etc.)

    class Meta:
        model = Vote
        fields = ['id', 'project_id', 'vote', 'vote_count', 'email', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, attrs):
        request = self.context.get('request')
        project = attrs.get('project')
        vote_count = attrs.get('vote_count')

        # Vérifier si le projet est en statut "vote"
        if project.platform_status != 'vote':
            raise serializers.ValidationError({"project": _("Ce projet n'est pas ouvert aux votes.")})

        # Vérifier si le vote_count est valide (existe dans VotePrice)
        if not VotePrice.objects.filter(vote_count=vote_count, active=True).exists():
            raise serializers.ValidationError({"vote_count": _("Nombre de votes invalide ou non disponible.")})

        # Si l'utilisateur est authentifié
        if request.user.is_authenticated:
            attrs['user'] = request.user
        else:
            # Si non authentifié, un email est requis
            if not attrs.get('email'):
                raise serializers.ValidationError({"email": _("Un email est requis pour voter sans compte.")})
            
            # Créer ou récupérer un utilisateur temporaire
            email = attrs['email']
            if not User.objects.filter(email=email).exists():
                user = User.objects.create(
                    email=email,
                    username=email.split('@')[0],
                    full_name=email.split('@')[0],
                    user_type='user',
                    is_active=False  # Utilisateur non activé pour votes anonymes
                )
                attrs['user'] = user
            else:
                attrs['user'] = User.objects.get(email=email)

        return attrs

    def create(self, validated_data):
        vote_count = validated_data.pop('vote_count', None)
        email = validated_data.pop('email', None)

        # Créer le vote, mais le marquer comme non actif jusqu'au paiement
        vote = Vote.objects.create(**validated_data, active=False)
        
        # Associer le prix du vote pour référence
        vote_price = VotePrice.objects.get(vote_count=vote_count)
        vote.vote_count = vote_count  # Si vous ajoutez un champ vote_count au modèle Vote (voir ci-dessous)
        vote.save()
        
        return vote
    

class VotePaymentSerializer(serializers.ModelSerializer):
    vote_id = serializers.PrimaryKeyRelatedField(queryset=Vote.objects.all(), source='vote')

    class Meta:
        model = VotePayment
        fields = ['id', 'vote_id', 'amount', 'status', 'payment_method', 'transaction_id', 'created_at', 'paid_at']
        read_only_fields = ['status', 'transaction_id', 'created_at', 'paid_at']

    def validate(self, attrs):
        vote = attrs.get('vote')
        vote_count = vote.vote_count  # Nombre de points du vote

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
        # Simuler un paiement (à remplacer par une intégration réelle, ex. Stripe)
        payment = VotePayment.objects.create(
            user=validated_data['vote'].user,
            vote=validated_data['vote'],
            amount=validated_data['amount'],
            status='en_attente',
            payment_method=validated_data.get('payment_method', 'unknown')
        )

        # Simuler un paiement réussi (à remplacer par une vérification réelle)
        payment.status = 'paye'
        payment.paid_at = timezone.now()
        payment.transaction_id = f"TXN_{uuid.uuid4().hex[:10].upper()}"
        payment.save()

        # Activer le vote après paiement réussi
        vote = payment.vote
        vote.active = True
        vote.save()

        return payment