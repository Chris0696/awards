from django.contrib.auth.password_validation import validate_password
from commercial.serializers import CommercialStatsSerializer
from project.models import Commercial, Category, Project
from projectowner.models import Owner
from project.serializers import CategoryStatsSerializer, ProjectCreateUpdateSerializer, RecentProjectSerializer, RecentVoteSerializer
from rest_framework import serializers
from userauths.models import Profile, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.translation import gettext_lazy as _
import re
from django.db import transaction


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
    affiliate = serializers.CharField(required=False, allow_blank=True, write_only=True)
    project = ProjectCreateUpdateSerializer(required=False, write_only=True)

    class Meta:
        model = User
        fields = ('full_name', 'email', 'country_code', 'phone', 'profession', 'password', 'age', 'affiliate', 'project')

    def validate(self, attrs):
        # Valider le code pays
        print("RegisterSerializer attrs:", attrs)
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
            affiliate_code = affiliate.split('affiliate=')[-1] if 'affiliate=' in affiliate else affiliate
            try:
                commercial = Commercial.objects.get(affiliate_link__endswith=affiliate_code)
                attrs['commercial'] = commercial
            except Commercial.DoesNotExist:
                raise serializers.ValidationError({"affiliate": _("Lien d'affiliation invalide.")})
            except Commercial.MultipleObjectsReturned:
                raise serializers.ValidationError({"affiliate": _("Plusieurs commerciaux correspondent à ce lien d'affiliation.")})

        # Valider les données du projet
        project_data = attrs.get('project')
        if project_data:
            print("Project data in RegisterSerializer:", project_data)  # Débogage
            project_context = {
                'skip_auth_validation': True,
                'request': self.context.get('request')
            }
            project_serializer = ProjectCreateUpdateSerializer(data=project_data, context=project_context)
            if not project_serializer.is_valid():
                print("Project serializer errors:", project_serializer.errors)  # Débogage
                raise serializers.ValidationError({"project": project_serializer.errors})
            attrs['project'] = project_serializer.validated_data

        return attrs

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("Cet email est déjà utilisé."))
        return value

    @transaction.atomic
    def create(self, validated_data):
        # Extraire les champs
        phone = validated_data.pop('phone', None)
        country_code = validated_data.pop('country_code', None)
        profession = validated_data.pop('profession', None)
        age = validated_data.pop('age', None)
        commercial = validated_data.pop('commercial', None)
        project_data = validated_data.pop('project', None)

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

        # Créer le profil Owner
        owner = Owner.objects.create(
            user=user,
            full_name=user.full_name,
            phone=phone,
            country_code=country_code,
            profession=profession,
            age=age,
            commercial=commercial
        )

        # Créer le projet si fourni
        project = None
        if project_data:
            project_data['owner'] = owner
            if commercial:
                project_data['commercial'] = commercial
            project_context = {'skip_auth_validation': True}
            project_serializer = ProjectCreateUpdateSerializer(context=project_context)
            project = project_serializer.create(project_data)

        # Retourner les données
        response_data = {
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'username': user.username,
                'user_type': user.user_type
            },
            'project': ProjectCreateUpdateSerializer(project).data if project else None
        }
        return response_data
    

class AdminDashboardSerializer(serializers.Serializer):
    general_stats = serializers.DictField(child=serializers.IntegerField(allow_null=True))
    user_stats = serializers.DictField(child=serializers.IntegerField(allow_null=True))
    vote_stats = serializers.DictField(child=serializers.FloatField(allow_null=True))
    recent_activity = serializers.DictField(child=serializers.IntegerField(allow_null=True))
    top_categories = CategoryStatsSerializer(many=True)
    top_commercials = CommercialStatsSerializer(many=True)
    

class OwnerDashboardSerializer(serializers.Serializer):
    profile = serializers.DictField()
    project_stats = serializers.DictField(child=serializers.IntegerField(allow_null=True))
    vote_stats = serializers.DictField(child=serializers.FloatField(allow_null=True))
    recent_projects = RecentProjectSerializer(many=True)
    recent_votes = RecentVoteSerializer(many=True)
    owner_ranking = serializers.DictField(child=serializers.IntegerField(allow_null=True))
    top_project_votes = serializers.IntegerField() 
    
