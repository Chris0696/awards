from django.shortcuts import render
from rest_framework.decorators import action, api_view, permission_classes
from datetime import datetime, timedelta
# from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import ValidationError
import logging
from userauths.permissions import IsAdminOrReadOnly
from commercial.serializers import CommercialSerializer
from projectowner.models import Owner
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import viewsets
from rest_framework.views import APIView
from django.db import transaction
from django.utils import timezone
from django.db.models import Count, Sum, Avg, Q
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
import json

from django.utils.translation import gettext_lazy as _
from .models import Category, Commercial, Project, ProjectSubmissionSettings, Vote, VotePayment, VotePriceSettings
from .serializers import CategoryAdminSerializer, CategorySerializer, ProjectAdminSerializer, ProjectCreateUpdateSerializer, ProjectDetailSerializer, ProjectListSerializer, ProjectSubmissionWithPaymentSerializer, VoteAndPaymentSerializer, VotePriceSettingsSerializer, PublicProjectListSerializer, ProjectAnalyticsVoteSerializer, PublicProjectSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework import serializers
from rest_framework.permissions import BasePermission


logger = logging.getLogger(__name__)


class IsProjectOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.user_type == 'admin':
            return True
        try:
            owner = Owner.objects.get(user=request.user)
            return obj.owner == owner
        except Owner.DoesNotExist:
            return False


# class ProjectCreateView(generics.CreateAPIView):
#     queryset = Project.objects.all()
#     serializer_class = ProjectSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save()


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


# === VUES CATEGORIES ===
# class CategoryListAPIView(generics.ListAPIView):
#     queryset = Category.objects.filter(active=True)
#     serializer_class = CategorySerializer
#     permission_classes = [AllowAny]
#     ordering = ['category_name']
    

# === VUES CATEGORIES ===
class ActiveCategoryListView(generics.ListAPIView):
    """
    Endpoint public pour récupérer la liste des catégories actives
    À utiliser dans le frontend pour populer la liste déroulante
    """
    serializer_class = CategorySerializer
    queryset = Category.objects.filter(active=True).order_by('category_name')
    permission_classes = []  # Accessible sans authentification


class CategoryAdminViewSet(viewsets.ModelViewSet):
    serializer_class = CategoryAdminSerializer
    queryset = Category.objects.all().order_by('category_name')
    permission_classes = [IsAdminUser]  # Seuls les admins peuvent gérer les catégories
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response({
                'message': 'Catégorie créée avec succès.',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            logger.error(f"Erreur lors de la création de la catégorie : {str(e)}")
            return Response({
                'message': 'Erreur lors de la création de la catégorie.',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Erreur inattendue lors de la création : {str(e)}")
            return Response({
                'message': 'Une erreur inattendue s\'est produite.',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            action = 'mise à jour partielle' if partial else 'mise à jour complète'
            return Response({
                'message': f'Catégorie {action} avec succès.',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except ValidationError as e:
            logger.error(f"Erreur lors de la mise à jour de la catégorie : {str(e)}")
            return Response({
                'message': 'Erreur lors de la mise à jour de la catégorie.',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Erreur inattendue lors de la mise à jour : {str(e)}")
            return Response({
                'message': "Une erreur inattendue s'est produite.",
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            category_name = instance.category_name
            self.perform_destroy(instance)
            return Response({
                'message': f"Catégorie '{category_name}' supprimée avec succès."
            }, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Erreur lors de la suppression de la catégorie : {str(e)}")
            return Response({
                'message': 'Erreur lors de la suppression de la catégorie.',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response({
                'message': 'Catégorie récupérée avec succès.',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Erreur lors de la récupération de la catégorie : {str(e)}")
            return Response({
                'message': 'Erreur lors de la récupération de la catégorie.',
                'error': str(e)
            }, status=status.HTTP_404_NOT_FOUND)

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response({
                'message': 'Liste des catégories récupérée avec succès.',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Erreur lors de la récupération de la liste des catégories : {str(e)}")
            return Response({
                'message': 'Erreur lors de la récupération de la liste des catégories.',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class ProjectAdminViewSet(viewsets.ModelViewSet):
    """ViewSet pour l'administration complète des projets"""
    queryset = Project.objects.all().select_related(
        'category', 'owner__user', 'commercial__user'
    ).prefetch_related('vote_set')
    serializer_class = ProjectAdminSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'project_id'
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtres optionnels
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(platform_status=status_filter)
        
        category_filter = self.request.query_params.get('category', None)
        if category_filter:
            queryset = queryset.filter(category_id=category_filter)
        
        featured_filter = self.request.query_params.get('featured', None)
        if featured_filter is not None:
            queryset = queryset.filter(featured=featured_filter.lower() == 'true')
        
        # Recherche par titre
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(project_title__icontains=search) |
                Q(description__icontains=search) |
                Q(owner__user__first_name__icontains=search) |
                Q(owner__user__last_name__icontains=search)
            )
        
        return queryset.order_by('-created_at')

    @action(detail=True, methods=['post'])
    def validate_project(self, request, project_id=None):
        """Valider un projet (le publier)"""
        project = self.get_object()
        
        comment = request.data.get('admin_comment', '')
        
        project.platform_status = 'publie'
        project.admin_comment = comment
        project.validated_at = timezone.now()
        project.save()
        
        return Response({
            'message': 'Projet validé et publié avec succès',
            'project': self.get_serializer(project).data
        })

    @action(detail=True, methods=['post'])
    def reject_project(self, request, project_id=None):
        """Rejeter un projet"""
        project = self.get_object()
        
        comment = request.data.get('admin_comment', '')
        if not comment:
            return Response({
                'error': 'Un commentaire de rejet est requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        project.platform_status = 'rejete'
        project.admin_comment = comment
        project.save()
        
        return Response({
            'message': 'Projet rejeté',
            'project': self.get_serializer(project).data
        })

    @action(detail=True, methods=['post'])
    def toggle_featured(self, request, project_id=None):
        """Basculer le statut "en vedette" d'un projet"""
        project = self.get_object()
        project.featured = not project.featured
        project.save()
        
        return Response({
            'message': f'Projet {"mis en vedette" if project.featured else "retiré de la vedette"}',
            'featured': project.featured
        })

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Statistiques pour le tableau de bord admin"""
        total_projects = Project.objects.count()
        published_projects = Project.objects.filter(platform_status='publie').count()
        pending_projects = Project.objects.filter(platform_status='en_attente').count()
        rejected_projects = Project.objects.filter(platform_status='rejete').count()
        draft_projects = Project.objects.filter(platform_status='brouillon').count()
        
        # Statistiques des votes
        total_votes = Vote.objects.filter(active=True).count()
        total_revenue = VotePayment.objects.filter(status='approved').aggregate(
            total=Sum('amount'))['total'] or 0
        
        # Projets récents (7 derniers jours)
        week_ago = timezone.now() - timedelta(days=7)
        recent_projects = Project.objects.filter(created_at__gte=week_ago).count()
        
        return Response({
            'projects': {
                'total': total_projects,
                'published': published_projects,
                'pending': pending_projects,
                'rejected': rejected_projects,
                'draft': draft_projects,
                'recent': recent_projects
            },
            'votes': {
                'total': total_votes,
                'revenue': float(total_revenue)
            }
        })
        

# === VUE PROJECT ===

class ProjectListCreateAPIView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectCreateUpdateSerializer
        return ProjectListSerializer
    
    def get_queryset(self):
        # Filtrer selon le type d'utilisateur
        user = self.request.user
        
        if user.is_staff or user.user_type == 'admin':
            # Admin voit tous les projets
            return Project.objects.all().select_related('category', 'owner', 'commercial')
        elif user.user_type == 'owner':
            # Owner voit seulement ses projets
            try:
                owner = Owner.objects.get(user=user)
                return Project.objects.filter(owner=owner).select_related('category', 'commercial')
            except Owner.DoesNotExist:
                return Project.objects.none()
        elif user.user_type == 'commercial':
            # Commercial voit les projets qu'il a amenés
            try:
                commercial = Commercial.objects.get(user=user)
                return Project.objects.filter(commercial=commercial).select_related('category', 'owner')
            except Commercial.DoesNotExist:
                return Project.objects.none()
        else:
            # Utilisateurs normaux voient seulement les projets publiés
            return Project.objects.filter(platform_status='publie').select_related('category', 'owner')


# class ProjectSubmissionWithPaymentAPIView(generics.CreateAPIView):
#     """API pour soumettre un nouveau projet avec paiement"""
#     serializer_class = ProjectSubmissionWithPaymentSerializer
#     permission_classes = [IsAuthenticated]

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
        
#         try:
#             with transaction.atomic():
#                 result = serializer.save()
                
#             return Response({
#                 'success': True,
#                 'message': _('Projet soumis avec succès'),
#                 'data': result
#             }, status=status.HTTP_201_CREATED)
            
#         except Exception as e:
#             return Response({
#                 'success': False,
#                 'message': _('Erreur lors de la soumission du projet'),
#                 'error': str(e)
#             }, status=status.HTTP_400_BAD_REQUEST)


class ProjectSubmissionWithPaymentAPIView(generics.CreateAPIView):
    """API pour soumettre un nouveau projet avec paiement - Support FormData"""
    serializer_class = ProjectSubmissionWithPaymentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        print(f"🔍 DEBUG ProjectSubmission - Content-Type: {request.content_type}")
        print(f"🔍 DEBUG ProjectSubmission - Request data keys: {list(request.data.keys())}")
        print(f"🔍 DEBUG ProjectSubmission - Request FILES keys: {list(request.FILES.keys())}")
        
        try:
            # Préprocesser les données FormData si nécessaire
            processed_data = self.preprocess_submission_data(request)
            
            serializer = self.get_serializer(data=processed_data)
            serializer.is_valid(raise_exception=True)
            
            with transaction.atomic():
                result = serializer.save()
                
            return Response({
                'success': True,
                'message': _('Projet soumis avec succès'),
                'data': result
            }, status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            print(f"❌ DEBUG ProjectSubmission - Erreurs de validation: {e}")
            return Response({
                'success': False,
                'message': _('Erreur de validation'),
                'errors': e.detail if hasattr(e, 'detail') else str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            print(f"❌ DEBUG ProjectSubmission - Erreur inattendue: {str(e)}")
            logger.exception("Erreur lors de la soumission du projet avec paiement")
            return Response({
                'success': False,
                'message': _('Erreur lors de la soumission du projet'),
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def preprocess_submission_data(self, request):
        """
        Préprocesse les données de soumission FormData
        """
        print("🔍 DEBUG ProjectSubmission - Préprocessing des données...")
        
        processed_data = {}
        
        # Traitement des données projet et paiement
        if request.content_type and request.content_type.startswith('multipart/'):
            print("🔍 DEBUG ProjectSubmission - FormData détecté")
            
            for key, value in request.data.items():
                if key == 'project':
                    # Désérialiser le JSON du projet
                    if isinstance(value, str):
                        print(f"🔍 DEBUG ProjectSubmission - Project data (string): {value[:200]}...")
                        try:
                            project_data = json.loads(value)
                            processed_data[key] = project_data
                            print("✅ DEBUG ProjectSubmission - Project JSON désérialisé")
                        except json.JSONDecodeError as e:
                            print(f"❌ DEBUG ProjectSubmission - Erreur JSON projet: {str(e)}")
                            raise ValueError(f"Format JSON invalide pour le projet: {str(e)}")
                    else:
                        processed_data[key] = value
                        
                elif key == 'payment':
                    # Désérialiser le JSON du paiement
                    if isinstance(value, str):
                        print(f"🔍 DEBUG ProjectSubmission - Payment data (string): {value[:200]}...")
                        try:
                            payment_data = json.loads(value)
                            processed_data[key] = payment_data
                            print("✅ DEBUG ProjectSubmission - Payment JSON désérialisé")
                        except json.JSONDecodeError as e:
                            print(f"❌ DEBUG ProjectSubmission - Erreur JSON paiement: {str(e)}")
                            raise ValueError(f"Format JSON invalide pour le paiement: {str(e)}")
                    else:
                        processed_data[key] = value
                else:
                    processed_data[key] = value
            
            # Ajouter les fichiers
            if 'project.image' in request.FILES:
                processed_data['project']['image'] = request.FILES['project.image']
                print(f"🔍 DEBUG - Fichier project.image: {request.FILES['project.image'].name}")
            if 'project.file' in request.FILES:
                processed_data['project']['file'] = request.FILES['project.file']
                print(f"🔍 DEBUG - Fichier project.file: {request.FILES['project.file'].name}")
                
        else:
            print("🔍 DEBUG ProjectSubmission - JSON standard")
            processed_data = request.data
        
        print("✅ DEBUG ProjectSubmission - Préprocessing terminé")
        return processed_data


# views.py - API utilitaires

@api_view(['GET'])
@permission_classes([AllowAny])
def get_submission_price(request):
    """Récupérer le prix de soumission actuel"""
    price = ProjectSubmissionSettings.get_submission_price()
    return Response({
        'submission_price': price,
        'currency': 'F'
    })


class ProjectDetailAPIView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'project_id'
    
    def get_queryset(self):
        user = self.request.user
        
        if user.is_staff or user.user_type == 'admin':
            return Project.objects.all()
        elif user.user_type == 'owner':
            try:
                owner = Owner.objects.get(user=user)
                return Project.objects.filter(owner=owner)
            except Owner.DoesNotExist:
                return Project.objects.none()
        elif user.user_type == 'commercial':
            try:
                commercial = Commercial.objects.get(user=user)
                return Project.objects.filter(commercial=commercial)
            except Commercial.DoesNotExist:
                return Project.objects.none()
        else:
            return Project.objects.filter(platform_status='publie')


# class ProjectUpdateAPIView(generics.UpdateAPIView):
#     queryset = Project.objects.all()
#     serializer_class = ProjectCreateUpdateSerializer
#     permission_classes = [IsAuthenticated, IsProjectOwnerOrAdmin]
#     lookup_field = 'project_id'
    
#     def get_queryset(self):
#         # Seuls les propriétaires peuvent modifier leurs projets
#         try:
#             owner = Owner.objects.get(user=self.request.user)
#             return Project.objects.filter(owner=owner)
#         except Owner.DoesNotExist:
#             return Project.objects.none()


class ProjectUpdateAPIView(generics.UpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsProjectOwnerOrAdmin]
    parser_classes = [JSONParser, MultiPartParser, FormParser]  # Ajout des parsers FormData
    lookup_field = 'project_id'
    
    def format_validation_errors(self, detail):
        errors = []
        if isinstance(detail, dict):
            for _, messages in detail.items():
                if isinstance(messages, list):
                    errors.extend(messages)
                else:
                    errors.append(str(messages))
        elif isinstance(detail, list):
            errors = detail
        else:
            errors = [str(detail)]
        return errors
    
    def get_queryset(self):
        # Seuls les propriétaires peuvent modifier leurs projets
        try:
            owner = Owner.objects.get(user=self.request.user)
            return Project.objects.filter(owner=owner)
        except Owner.DoesNotExist:
            return Project.objects.none()

    def update(self, request, *args, **kwargs):
        print(f"🔍 DEBUG ProjectUpdate - Content-Type: {request.content_type}")
        print(f"🔍 DEBUG ProjectUpdate - Request data keys: {list(request.data.keys())}")
        print(f"🔍 DEBUG ProjectUpdate - Request FILES keys: {list(request.FILES.keys())}")
        
        # Obtenir l'instance du projet
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        try:
            # Préprocesser les données si FormData
            processed_data = self.preprocess_update_data(request)
            
            serializer = self.get_serializer(instance, data=processed_data, partial=partial)
            serializer.is_valid(raise_exception=True)
            
            print("✅ DEBUG ProjectUpdate - Validation réussie, mise à jour en cours...")
            self.perform_update(serializer)
            
            if getattr(instance, '_prefetched_objects_cache', None):
                instance._prefetched_objects_cache = {}

            print("✅ DEBUG ProjectUpdate - Mise à jour terminée avec succès")
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"❌ DEBUG ProjectUpdate - Erreur inattendue: {str(e)}")
            logger.exception("Erreur lors de la mise à jour du projet")
            return Response(
                {"error": self.format_validation_errors(e.detail)
                
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def preprocess_update_data(self, request):
        """
        Préprocesse les données de mise à jour FormData
        """
        print("🔍 DEBUG ProjectUpdate - Préprocessing des données...")
        
        processed_data = {}
        
        if request.content_type and request.content_type.startswith('multipart/'):
            print("🔍 DEBUG ProjectUpdate - FormData détecté")
            
            for key, value in request.data.items():
                # Pas de preprocessing spécial nécessaire pour les projets
                # contrairement à l'inscription, car ici on travaille directement avec les champs
                processed_data[key] = value
            
            # Ajouter les fichiers
            for key, file_obj in request.FILES.items():
                processed_data[key] = file_obj
                print(f"🔍 DEBUG ProjectUpdate - Fichier {key}: {file_obj.name} ({file_obj.size} bytes)")
                
        else:
            print("🔍 DEBUG ProjectUpdate - JSON standard")
            processed_data = request.data
        
        print("✅ DEBUG ProjectUpdate - Préprocessing terminé")
        return processed_data

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

class ProjectDeleteAPIView(generics.DestroyAPIView):
    queryset = Project.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsProjectOwnerOrAdmin]
    lookup_field = 'project_id'


    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.user_type == 'admin':
            return Project.objects.all()
        try:
            owner = Owner.objects.get(user=user)
            return Project.objects.filter(owner=owner)
        except Owner.DoesNotExist:
            return Project.objects.none()
        
# Affichage publique des projets ----------------------------------

class PublicProjectsPagination(PageNumberPagination):
    """Pagination pour les projets publics"""
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 50


class PublicProjectListAPIView(generics.ListAPIView):
    """API publique pour lister les projets publiés"""
    serializer_class = PublicProjectListSerializer
    permission_classes = [AllowAny]
    # pagination_class = PublicProjectsPagination
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Filtres disponibles
    filterset_fields = ['category', 'featured']
    search_fields = ['project_title', 'description', 'target_audience', 'local_area_impact']
    ordering_fields = ['created_at', 'validated_at', 'estimated_budget']
    ordering = ['-featured', '-validated_at']  # Projets en vedette d'abord, puis les plus récents

    def get_queryset(self):
        """Récupère uniquement les projets publiés"""
        queryset = Project.objects.filter(
            platform_status='publie'
        ).select_related(
            'category', 'owner__user'
        ).prefetch_related(
            'vote_set'
        )

        # Filtre par budget minimum/maximum
        min_budget = self.request.query_params.get('min_budget', None)
        max_budget = self.request.query_params.get('max_budget', None)
        
        if min_budget:
            try:
                queryset = queryset.filter(estimated_budget__gte=float(min_budget))
            except ValueError:
                pass
                
        if max_budget:
            try:
                queryset = queryset.filter(estimated_budget__lte=float(max_budget))
            except ValueError:
                pass

        # Filtre par note minimum
        min_rating = self.request.query_params.get('min_rating', None)
        if min_rating:
            try:
                min_rating = float(min_rating)
                # Filtrer les projets avec une note moyenne >= min_rating
                queryset = queryset.annotate(
                    avg_rating=Avg('vote__vote', filter=Q(vote__active=True))
                ).filter(avg_rating__gte=min_rating)
            except ValueError:
                pass

        return queryset


class PublicProjectDetailAPIView(generics.RetrieveAPIView):
    """API publique pour voir le détail d'un projet publié"""
    serializer_class = PublicProjectSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'  # Utilise le slug pour une URL plus jolie

    def get_queryset(self):
        """Récupère uniquement les projets publiés"""
        return Project.objects.filter(
            platform_status='publie'
        ).select_related(
            'category', 'owner__user', 'commercial__user'
        ).prefetch_related(
            'vote_set__user'
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def public_projects_stats(request):
    """Statistiques publiques des projets"""
    published_projects = Project.objects.filter(platform_status='publie')
    
    total_projects = published_projects.count()
    featured_projects = published_projects.filter(featured=True).count()
    
    # Statistiques par catégorie
    categories_stats = published_projects.values(
        'category__name'
    ).annotate(
        count=Count('id')
    ).order_by('-count')[:5]
    
    # Budget total des projets
    total_estimated_budget = published_projects.aggregate(
        total=Sum('estimated_budget')
    )['total'] or 0
    
    # Votes et revenus
    total_active_votes = Vote.objects.filter(
        project__platform_status='publie', 
        active=True
    ).count()
    
    total_revenue = VotePayment.objects.filter(
        vote__project__platform_status='publie',
        status='paye'
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    return Response({
        'projects': {
            'total': total_projects,
            'featured': featured_projects,
            'total_estimated_budget': float(total_estimated_budget)
        },
        'categories': list(categories_stats),
        'engagement': {
            'total_votes': total_active_votes,
            'total_revenue': float(total_revenue)
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def featured_projects(request):
    """API pour récupérer uniquement les projets en vedette"""
    featured_projects = Project.objects.filter(
        platform_status='publie',
        featured=True
    ).select_related(
        'category', 'owner__user'
    ).order_by('-validated_at')[:6]  # Les 6 derniers projets en vedette
    
    serializer = PublicProjectListSerializer(
        featured_projects, 
        many=True, 
        context={'request': request}
    )
    
    return Response({
        'count': featured_projects.count(),
        'results': serializer.data
    })


@api_view(['GET']) 
@permission_classes([AllowAny])
def trending_projects(request):
    """Projets tendances (les plus votés récemment)"""
    from datetime import timedelta
    from django.utils import timezone
    
    # Projets avec le plus de votes dans les 30 derniers jours
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    trending = Project.objects.filter(
        platform_status='publie'
    ).annotate(
        recent_votes=Count(
            'vote',
            filter=Q(
                vote__active=True,
                vote__created_at__gte=thirty_days_ago
            )
        )
    ).filter(
        recent_votes__gt=0
    ).order_by('-recent_votes')[:10]
    
    serializer = PublicProjectListSerializer(
        trending,
        many=True,
        context={'request': request}
    )
    
    return Response({
        'count': trending.count(),
        'results': serializer.data
    })



# === VUES VOTE ===
        

class VoteAndPaymentCreateAPIView(generics.CreateAPIView):
    """
    API pour créer un vote et traiter le paiement en une seule requête
    """
    queryset = Vote.objects.all()
    serializer_class = VoteAndPaymentSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            with transaction.atomic():
                vote = serializer.save()
                
            # Message selon le statut du paiement
            if vote.active:
                message = _('Vote créé et validé avec succès')
            else:
                message = _('Vote créé, en attente de validation du paiement')
                
                
            return Response({
                'success': True,
                'message': message,
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': _('Erreur lors de la création du vote'),
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_vote_price(request):
    """
    API pour récupérer le prix actuel d'un vote
    """
    price = VotePriceSettings.get_vote_price()
    return Response({
        'vote_price': price,
        'currency': 'F'  # ou votre devise
    })


@api_view(['POST'])
@permission_classes([AllowAny])  
def calculate_vote_cost(request):
    """
    API pour calculer le coût total d'un nombre de votes
    """
    vote_count = request.data.get('vote_count', 1)
    
    try:
        vote_count = int(vote_count)
        if vote_count < 1:
            return Response({
                'error': 'Le nombre de votes doit être supérieur à 0'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        vote_price = VotePriceSettings.get_vote_price()
        total_cost = vote_price * vote_count
        
        return Response({
            'vote_count': vote_count,
            'unit_price': vote_price,
            'total_cost': total_cost,
            'currency': 'F'
        })
        
    except (ValueError, TypeError):
        return Response({
            'error': 'Nombre de votes invalide'
        }, status=status.HTTP_400_BAD_REQUEST)


class VotePriceSettingsAPIView(generics.RetrieveUpdateAPIView):
    """
    API pour gérer la configuration globale (réservé aux admins)
    """
    queryset = VotePriceSettings.objects.all()
    serializer_class =VotePriceSettingsSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    
    def get_object(self):
        settings, created = VotePriceSettings.objects.get_or_create(
            defaults={'vote_price': 100.00}
        )
        return settings
