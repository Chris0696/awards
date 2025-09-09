from django.shortcuts import render
from rest_framework.decorators import action, api_view, permission_classes
from datetime import datetime, timedelta

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

from django.utils.translation import gettext_lazy as _
from .models import Category, Commercial, Project, Vote, VotePayment, VotePriceSettings
from .serializers import CategoryAdminSerializer, CategorySerializer, ProjectAdminSerializer, ProjectCreateUpdateSerializer, ProjectDetailSerializer, ProjectListSerializer, VoteAndPaymentSerializer, VotePriceSettingsSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework import serializers
from rest_framework.permissions import BasePermission


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
        total_revenue = VotePayment.objects.filter(status='paye').aggregate(
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


class ProjectUpdateAPIView(generics.UpdateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsProjectOwnerOrAdmin]
    lookup_field = 'project_id'
    
    def get_queryset(self):
        # Seuls les propriétaires peuvent modifier leurs projets
        try:
            owner = Owner.objects.get(user=self.request.user)
            return Project.objects.filter(owner=owner)
        except Owner.DoesNotExist:
            return Project.objects.none()


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
        

# === VUES VOTE ===
        
# class VoteCreateAPIView(generics.CreateAPIView):
#     queryset = Vote.objects.all()
#     serializer_class = VoteSerializer
#     permission_classes = [permissions.AllowAny]


# class VoteListAPIView(generics.ListAPIView):
#     serializer_class = VoteSerializer
#     permission_classes = [permissions.IsAuthenticated]
    # filter_backends = [DjangoFilterBackend, OrderingFilter]
    # ordering_fields = ['created_at', 'vote', 'vote_count']
    # ordering = ['-created_at']
    # pagination_class = StandardResultsSetPagination

    # def get_queryset(self):
    #     user = self.request.user
    #     if user.is_staff or user.user_type == 'admin':
    #         return Vote.objects.all().select_related('user', 'project')
    #     elif user.user_type == 'owner':
    #         try:
    #             owner = Owner.objects.get(user=user)
    #             return Vote.objects.filter(project__owner=owner).select_related('user', 'project')
    #         except Owner.DoesNotExist:
    #             return Vote.objects.none()
    #     return Vote.objects.none()  # Aucun vote visible pour les utilisateurs lambda
    
    
# class VoteDetailAPIView(generics.RetrieveAPIView):  # Remplacer RetrieveUpdateAPIView par RetrieveAPIView
#     queryset = Vote.objects.all()
#     serializer_class = VoteSerializer
#     permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
#     lookup_field = 'id'

#     def get_queryset(self):
#         user = self.request.user
#         if user.is_staff or user.user_type == 'admin':
#             return Vote.objects.all().select_related('user', 'project')
#         elif user.user_type == 'owner':
#             try:
#                 owner = Owner.objects.get(user=user)
#                 return Vote.objects.filter(project__owner=owner).select_related('user', 'project')
#             except Owner.DoesNotExist:
#                 return Vote.objects.none()
#         return Vote.objects.none()  # Aucun vote visible pour les utilisateurs lambda
        

# class VotePriceListAPIView(generics.ListCreateAPIView):
#     queryset = VotePrice.objects.all()
#     serializer_class = VotePriceSerializer
#     permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


# class VotePriceDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = VotePrice.objects.all()
#     serializer_class = VotePriceSerializer
#     permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


# class VotePaymentListAPIView(generics.ListAPIView):
#     queryset = VotePayment.objects.all()
#     serializer_class = VotePaymentSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         if user.is_superuser or user.user_type == 'admin':
#             return VotePayment.objects.all()
#         return VotePayment.objects.filter(user=user)


# class VotePaymentCreateAPIView(generics.CreateAPIView):
#     queryset = VotePayment.objects.all()
#     serializer_class = VotePaymentSerializer
#     permission_classes = [permissions.AllowAny]  # Peut être restreint à IsAuthenticated si nécessaire
    

# class VoteAndPayAPIView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = VoteAndPaySerializer(data=request.data, context={'request': request})
#         if serializer.is_valid():
#             result = serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

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
                
            return Response({
                'success': True,
                'message': _('Vote créé et payé avec succès'),
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
