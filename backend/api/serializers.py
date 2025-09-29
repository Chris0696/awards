from django.contrib.auth.password_validation import validate_password
from commercial.serializers import CommercialStatsSerializer
from project.models import Commercial, Category, Project, ProjectSubmissionPayment, ProjectSubmissionSettings
from projectowner.models import Owner
from project.serializers import CategoryStatsSerializer, ProjectCreateUpdateSerializer, ProjectPaymentSerializer, RecentProjectSerializer, RecentVoteSerializer
from rest_framework import serializers
from userauths.models import Profile, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.translation import gettext_lazy as _
import re
from django.db import transaction
from django.utils import timezone
from datetime import timedelta


# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(
#         write_only=True,
#         required=True,
#         min_length=8,
#         validators=[validate_password],
#         style={'input_type': 'password'}
#     )
#     full_name = serializers.CharField(max_length=100, required=True)
#     phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
#     country_code = serializers.CharField(max_length=5, required=False, allow_blank=True)
#     profession = serializers.CharField(required=False, allow_blank=True)
#     age = serializers.IntegerField(required=False, allow_null=True)
#     affiliate = serializers.CharField(required=False, allow_blank=True, write_only=True)
#     project = ProjectCreateUpdateSerializer(required=False, write_only=True)
#     accept_project_reformulation = serializers.BooleanField(
        
#         required=True,
#         error_messages={
#             'required': _("Vous devez accepter que votre projet soit reformulé par l'équipe Project Awards.")
#         }
#     )
    
#     accept_terms_of_use = serializers.BooleanField(
    
#         required=True,
#         error_messages={
#             'required': _("Vous devez accepter les conditions d'utilisation.")
#         }
#     )

#     class Meta:
#         model = User
#         fields = ('full_name', 'email', 'country_code', 'phone', 'profession', 'password', 'age', 'affiliate', 'project', 'accept_project_reformulation', 'accept_terms_of_use')

#     def validate(self, attrs):
#         print(f"🔍 DEBUG RegisterSerializer.validate - Attrs: {list(attrs.keys())}")
#         # Valider les cases à cocher
#         if not attrs.get('accept_project_reformulation'):
#             raise serializers.ValidationError({
#                 "error": {
#                     "accept_project_reformulation": [
#                         _("Vous devez accepter que votre projet soit reformulé par l'équipe Project Awards.")
#                     ]
#                 }
#             })
#         if not attrs.get('accept_terms_of_use'):
#             raise serializers.ValidationError({
#                 "error": {
#                     "accept_terms_of_use": [
#                         _("Vous devez accepter les conditions d'utilisation.")
#                     ]
#                 }
#             })
#         # Valider le code pays
#         print("RegisterSerializer attrs:", attrs)
#         country_code = attrs.get('country_code')
#         if country_code and not re.match(r'^\+\d{1,3}$', country_code):
#             raise serializers.ValidationError({
#                 "error": {
#                     "country_code": [_("Le code pays doit être au format + suivi de 1 à 3 chiffres (ex. +33).")]
#                 }
#                 })

#         # Valider le numéro de téléphone
#         phone = attrs.get('phone')
#         if phone and not re.match(r'^\d{7,15}$', phone):
#             raise serializers.ValidationError({
#                 "error": {
#                     "phone": [_("Le numéro de téléphone doit contenir entre 7 et 15 chiffres.")]
#                 }
#                 })

#         # Valider l'âge
#         age = attrs.get('age')
#         if age and (age < 18 or age > 120):
#             raise serializers.ValidationError({
#                 "error": {
#                     "age": [_("L'âge doit être compris entre 18 et 120 ans.")]
#                 }

#                 })

#         # Valider le lien d'affiliation
#         affiliate = attrs.get('affiliate')
#         if affiliate:
#             affiliate_code = affiliate.split('affiliate=')[-1] if 'affiliate=' in affiliate else affiliate
#             try:
#                 commercial = Commercial.objects.get(affiliate_link__endswith=affiliate_code)
#                 attrs['commercial'] = commercial
#             except Commercial.DoesNotExist:
#                 raise serializers.ValidationError({
#                     "error": {
#                         "affiliate": [_("Lien d'affiliation invalide.")]
#                     }
#                     })
#             except Commercial.MultipleObjectsReturned:
#                 raise serializers.ValidationError({
#                     "error": {
#                         "affiliate": [_("Plusieurs commerciaux correspondent à ce lien d'affiliation.")]
#                     }
#                     })

#         # Valider les données du projet
#         project_data = attrs.get('project')
#         if project_data:
#             print(f"🔍 DEBUG RegisterSerializer - Project data reçu: {project_data}")
            
#             project_context = {
#                 'skip_auth_validation': True,
#                 'request': self.context.get('request')
#             }
#             project_serializer = ProjectCreateUpdateSerializer(data=project_data, context=project_context)
#             if not project_serializer.is_valid():
#                 print("Project serializer errors:", project_serializer.errors)  # Débogage
#                 raise serializers.ValidationError({"project": project_serializer.errors})
#             attrs['project'] = project_serializer.validated_data
#             print("✅ DEBUG RegisterSerializer - Projet validé")

#         return attrs

#     def validate_email(self, value):
#         if User.objects.filter(email=value).exists():
#             raise serializers.ValidationError({
#                 "error" :{
#                     "email": _("Cet email est déjà utilisé.")
#                 }
#                 })
#         return value

#     @transaction.atomic
#     def create(self, validated_data):
#         print("🔍 DEBUG RegisterSerializer.create - Début création utilisateur")
#         # Extraire les champs
#         phone = validated_data.pop('phone', None)
#         country_code = validated_data.pop('country_code', None)
#         profession = validated_data.pop('profession', None)
#         age = validated_data.pop('age', None)
#         commercial = validated_data.pop('commercial', None)
#         project_data = validated_data.pop('project', None)
#         accept_project_reformulation = validated_data.pop('accept_project_reformulation')
#         accept_terms_of_use = validated_data.pop('accept_terms_of_use')

#         # Générer un username basé sur l'email
#         email = validated_data['email']
#         base_username = email.split('@')[0]
#         username = base_username
#         counter = 1
#         while User.objects.filter(username=username).exists():
#             username = f"{base_username}{counter}"
#             counter += 1

#         # Créer l'utilisateur avec user_type='owner'
#         user = User.objects.create_user(
#             email=validated_data['email'],
#             username=username,
#             full_name=validated_data['full_name'],
#             password=validated_data['password'],
#             user_type='owner'
#         )

#         # Créer le profil Owner
#         owner = Owner.objects.create(
#             user=user,
#             full_name=user.full_name,
#             phone=phone,
#             country_code=country_code,
#             profession=profession,
#             age=age,
#             commercial=commercial,
#             accept_project_reformulation=accept_project_reformulation,
#             accept_terms_of_use=accept_terms_of_use
#         )

#         # Créer le projet si fourni
#         project = None
#         if project_data:
#             print("🔍 DEBUG - Création du projet en cours...")
#             project_data['owner'] = owner
#             if commercial:
#                 project_data['commercial'] = commercial
#             project_context = {'skip_auth_validation': True}
#             project_serializer = ProjectCreateUpdateSerializer(context=project_context)
#             project = project_serializer.create(project_data)
#             print(f"✅ DEBUG - Projet créé: {project.project_id}")


#         # Retourner les données
#         response_data = {
#             'user': {
#                 'id': user.id,
#                 'email': user.email,
#                 'full_name': user.full_name,
#                 'username': user.username,
#                 'user_type': user.user_type
#             },
#             'project': ProjectCreateUpdateSerializer(project).data if project else None
#         }
        
#         print("✅ DEBUG RegisterSerializer.create - Création terminée avec succès")
#         return response_data



class RegisterOwnerWithPaymentSerializer(serializers.ModelSerializer):
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
    
    # Informations de paiement pour le projet
    project_payment = ProjectPaymentSerializer(required=False, write_only=True)
    
    accept_project_reformulation = serializers.BooleanField(
        
        required=True,
        error_messages={
            'required': _("Vous devez accepter que votre projet soit reformulé par l'équipe Project Awards.")
        }
    )
    
    accept_terms_of_use = serializers.BooleanField(
    
        required=True,
        error_messages={
            'required': _("Vous devez accepter les conditions d'utilisation.")
        }
    )

    class Meta:
        model = User
        fields = ('full_name', 'email', 'country_code', 'phone', 'profession', 'password', 'age', 'affiliate', 'project', 'project_payment', 'accept_project_reformulation', 'accept_terms_of_use')

    def validate(self, attrs):
        print(f"🔍 DEBUG RegisterSerializer.validate - Attrs: {list(attrs.keys())}")
        # Valider les cases à cocher
        if not attrs.get('accept_project_reformulation'):
            raise serializers.ValidationError({
                "error": {
                    "accept_project_reformulation": [
                        _("Vous devez accepter que votre projet soit reformulé par l'équipe Project Awards.")
                    ]
                }
            })
        if not attrs.get('accept_terms_of_use'):
            raise serializers.ValidationError({
                "error": {
                    "accept_terms_of_use": [
                        _("Vous devez accepter les conditions d'utilisation.")
                    ]
                }
            })
        # Valider le code pays
        print("RegisterSerializer attrs:", attrs)
        country_code = attrs.get('country_code')
        # if country_code and not re.match(r'^\+\d{1,3}$', country_code):
        #     raise serializers.ValidationError({
        #         "error": {
        #             "country_code": [_("Le code pays doit être au format + suivi de 1 à 3 chiffres (ex. +33).")]
        #         }
        #         })

        # Valider le numéro de téléphone
        phone = attrs.get('phone')
        # if phone and not re.match(r'^\d{7,15}$', phone):
        #     raise serializers.ValidationError({
        #         "error": {
        #             "phone": [_("Le numéro de téléphone doit contenir entre 7 et 15 chiffres.")]
        #         }
        #         })

        # Valider l'âge
        age = attrs.get('age')
        if age and (age < 18 or age > 120):
            raise serializers.ValidationError({
                "error": {
                    "age": [_("L'âge doit être compris entre 18 et 120 ans.")]
                }

                })

        # Valider le lien d'affiliation
        affiliate = attrs.get('affiliate')
        if affiliate:
            affiliate_code = affiliate.split('affiliate=')[-1] if 'affiliate=' in affiliate else affiliate
            try:
                commercial = Commercial.objects.get(affiliate_link__endswith=affiliate_code)
                attrs['commercial'] = commercial
            except Commercial.DoesNotExist:
                raise serializers.ValidationError({
                    "error": {
                        "affiliate": [_("Lien d'affiliation invalide.")]
                    }
                    })
            except Commercial.MultipleObjectsReturned:
                raise serializers.ValidationError({
                    "error": {
                        "affiliate": [_("Plusieurs commerciaux correspondent à ce lien d'affiliation.")]
                    }
                    })
        
        # Validation du projet (obligatoire pour l'enregistrement)
        if not attrs.get('project'):
            raise serializers.ValidationError({
                "project": [_("Un projet est obligatoire lors de l'enregistrement.")]
            })

        # Valider les données du projet
        project_data = attrs.get('project')
        if project_data:
            print(f"🔍 DEBUG RegisterSerializer - Project data reçu: {project_data}")
            
            project_context = {
                'skip_auth_validation': True,
                'request': self.context.get('request')
            }
            project_serializer = ProjectCreateUpdateSerializer(data=project_data, context=project_context)
            if not project_serializer.is_valid():
                print("Project serializer errors:", project_serializer.errors)  # Débogage
                raise serializers.ValidationError({"project": project_serializer.errors})
            attrs['project'] = project_serializer.validated_data
            print("✅ DEBUG RegisterSerializer - Projet validé")
            
        # Valider les données de paiement
        payment_data = attrs.get('project_payment')
        if payment_data:
            payment_serializer = ProjectPaymentSerializer(data=payment_data)
            if not payment_serializer.is_valid():
                raise serializers.ValidationError({"project_payment": payment_serializer.errors})
            attrs['project_payment'] = payment_serializer.validated_data

        return attrs

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError({
                "error" :{
                    "email": _("Cet email est déjà utilisé.")
                }
                })
        return value

    @transaction.atomic
    def create(self, validated_data):
        print("🔍 DEBUG RegisterSerializer.create - Début création utilisateur")
        # Extraire les champs
        phone = validated_data.pop('phone', None)
        country_code = validated_data.pop('country_code', None)
        profession = validated_data.pop('profession', None)
        age = validated_data.pop('age', None)
        commercial = validated_data.pop('commercial', None)
        project_data = validated_data.pop('project', None)
        payment_data = validated_data.pop('project_payment', None)
        accept_project_reformulation = validated_data.pop('accept_project_reformulation')
        accept_terms_of_use = validated_data.pop('accept_terms_of_use')

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
            commercial=commercial,
            accept_project_reformulation=accept_project_reformulation,
            accept_terms_of_use=accept_terms_of_use
        )

        # Créer le projet si fourni
        project = None
        if project_data:
            print("🔍 DEBUG - Création du projet en cours...")
            project_data['owner'] = owner
            if commercial:
                project_data['commercial'] = commercial
            project_context = {'skip_auth_validation': True}
            project_serializer = ProjectCreateUpdateSerializer(context=project_context)
            project = project_serializer.create(project_data)
            print(f"✅ DEBUG - Projet créé: {project.project_id}")
            
        
        # Créer le paiement de soumission
        if project and payment_data:
            submission_price = ProjectSubmissionSettings.get_submission_price()
            
            payment = ProjectSubmissionPayment.objects.create(
                user=user,
                project=project,
                amount=submission_price,
                status=payment_data['payment_status'],
                payment_method=payment_data['payment_method'],
                external_transaction_id=payment_data.get('external_transaction_id', ''),
                payment_reference=payment_data['payment_reference'],
                payer_name=payment_data['payer_name'],
                payer_email=payment_data['payer_email'],
                payer_phone=payment_data['payer_phone']
            )

            # Si le paiement est approuvé, activer le projet
            if payment_data['payment_status'] == 'approved':
                payment.paid_at = timezone.now()
                payment.save()
                
                # Marquer le projet comme publié (en attente de validation admin)
                project.owner_project_status = 'publie'
                project.save()


        # Retourner les données
        response_data = {
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'username': user.username,
                'user_type': user.user_type
            },
            'project': ProjectCreateUpdateSerializer(project).data if project else None,
            'payment_status': payment_data['payment_status'] if payment_data else None,
            'submission_price': float(submission_price) if project else None
        }
        
        print("✅ DEBUG RegisterSerializer.create - Création terminée avec succès")
        return response_data
    

class AdminDashboardSerializer(serializers.Serializer):
    general_stats = serializers.DictField(child=serializers.IntegerField(allow_null=True))
    user_stats = serializers.DictField(child=serializers.IntegerField(allow_null=True))
    vote_stats = serializers.DictField(child=serializers.FloatField(allow_null=True))
    recent_activity = serializers.DictField(child=serializers.IntegerField(allow_null=True))
    top_categories = CategoryStatsSerializer(many=True)
    top_commercials = CommercialStatsSerializer(many=True)
    

# class OwnerDashboardSerializer(serializers.Serializer):
#     profile = serializers.DictField()
#     project_stats = serializers.DictField(child=serializers.IntegerField(allow_null=True))
#     vote_stats = serializers.DictField(child=serializers.FloatField(allow_null=True))
#     recent_projects = RecentProjectSerializer(many=True)
#     recent_votes = RecentVoteSerializer(many=True)
#     owner_ranking = serializers.DictField(child=serializers.IntegerField(allow_null=True))
#     top_project_votes = serializers.IntegerField() 

class OwnerDashboardSerializer(serializers.Serializer):
    profile = serializers.DictField()
    project_stats = serializers.DictField()
    vote_stats = serializers.DictField()
    recent_projects = RecentProjectSerializer(many=True)
    recent_votes = RecentVoteSerializer(many=True)
    owner_ranking = serializers.DictField()
    top_project_votes = serializers.IntegerField()

