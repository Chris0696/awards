from django.shortcuts import render
from projectowner.models import Owner
from userauths.serializers import UserSerializer
from projectowner.serializers import OwnerSerializer
from userauths.permissions import IsAdminOrReadOnly
from project.serializers import ProjectDetailSerializer, ProjectListSerializer, VoteSerializer
from commercial.serializers import CommercialSerializer
from project.models import Commercial, Project, Category, User, Vote, VotePayment, VotePrice
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework import generics, permissions

from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q, Sum, Count


class IsProfileOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user_id = view.kwargs.get('user_id')
        return (request.user.is_authenticated and
                (request.user.id == int(user_id) or request.user.is_staff or request.user.user_type == 'admin'))

class UserProfileAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsProfileOwnerOrAdmin]

    def get_serializer_class(self):
        user_id = self.kwargs.get('user_id')
        user = User.objects.get(id=user_id)
        if user.user_type == 'commercial':
            return CommercialSerializer
        elif user.user_type == 'owner':
            return OwnerSerializer
        return UserSerializer  # Pour les utilisateurs lambda ou admin

    def get_object(self):
        user_id = self.kwargs.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            if user.user_type == 'commercial':
                return Commercial.objects.get(user=user)
            elif user.user_type == 'owner':
                return Owner.objects.get(user=user)
            return user  # Pour les utilisateurs lambda ou admin
        except (User.DoesNotExist, Commercial.DoesNotExist, Owner.DoesNotExist):
            return None

    def get(self, request, *args, **kwargs):
        obj = self.get_object()
        if not obj:
            return Response({"error": _("Profil non trouvé.")}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        if not obj:
            return Response({"error": _("Profil non trouvé.")}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Synchroniser full_name avec User si modifié dans Owner ou Commercial
            if hasattr(obj, 'user') and 'full_name' in request.data:
                obj.user.full_name = request.data['full_name']
                obj.user.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
# === VUES SPÉCIFIQUES POUR GESTION ADMIN ===
class AdminProjectsManagementAPIView(generics.ListAPIView):
    """Vue spéciale pour l'admin - gestion des projets en attente"""
    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    # filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    # search_fields = ['project_title', 'owner__full_name']
    # ordering = ['-created_at']
    # pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        # Par défaut, afficher les projets en attente de validation
        status_filter = self.request.query_params.get('status', 'vote')
        return Project.objects.filter(platform_status=status_filter).select_related(
            'category', 'owner', 'commercial'
        )


# === API POUR LES STATISTIQUES GÉNÉRALES ===
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def general_stats_api(request):
    """API pour obtenir des statistiques générales de la plateforme"""
    
    total_projects = Project.objects.count()
    total_published = Project.objects.filter(platform_status='publie').count()
    total_votes = Vote.objects.filter(active=True).count()
    total_users = User.objects.filter(is_active=True).count()
    
    return Response({
        'total_projects': total_projects,
        'total_published_projects': total_published,
        'total_votes': total_votes,
        'total_users': total_users
    }, status=status.HTTP_200_OK)
    

# === STATISTIQUES AVANCÉES ===
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def commercial_performance_stats(request, commercial_id):
    """Statistiques détaillées d'un commercial (Admin seulement)"""
    
    if not request.user.is_staff and request.user.user_type != 'admin':
        return Response(
            {"error": "Accès non autorisé"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        commercial = Commercial.objects.get(id=commercial_id)
    except Commercial.DoesNotExist:
        return Response(
            {"error": "Commercial non trouvé"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Statistiques détaillées
    projects = Project.objects.filter(commercial=commercial)
    
    stats_by_category = Category.objects.filter(
        project__commercial=commercial
    ).annotate(
        project_count=Count('project'),
        validated_count=Count('project', filter=Q(project__platform_status='valide')),
        votes_count=Count('project__vote', filter=Q(project__vote__active=True))
    ).values('category_name', 'project_count', 'validated_count', 'votes_count')
    
    monthly_performance = []
    for i in range(12):  # 12 derniers mois
        month_start = timezone.now().replace(day=1) - timedelta(days=30*i)
        month_end = month_start + timedelta(days=31)
        
        month_data = {
            'month': month_start.strftime('%m/%Y'),
            'projects': projects.filter(created_at__range=[month_start, month_end]).count(),
            'validated': projects.filter(
                created_at__range=[month_start, month_end],
                platform_status='valide'
            ).count(),
            'revenue': VotePayment.objects.filter(
                vote__project__commercial=commercial,
                created_at__range=[month_start, month_end],
                status='paye'
            ).aggregate(total=Sum('amount'))['total'] or 0
        }
        monthly_performance.append(month_data)
    
    data = {
        'commercial': CommercialSerializer(commercial).data,
        'stats_by_category': list(stats_by_category),
        'monthly_performance': monthly_performance[::-1],  # Plus récent d'abord
        'top_projects': ProjectListSerializer(
            projects.annotate(vote_count=Count('vote')).order_by('-vote_count')[:10],
            many=True
        ).data
    }
    
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_analytics(request, project_id):
    """Analytiques détaillées d'un projet"""
    
    try:
        project = Project.objects.get(project_id=project_id)
    except Project.DoesNotExist:
        return Response(
            {"error": "Projet non trouvé"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Vérifier les permissions
    user = request.user
    if not (user.is_staff or user.user_type == 'admin' or 
            (hasattr(user, 'owner') and user.owner == project.owner)):
        return Response(
            {"error": "Accès non autorisé"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Statistiques des votes
    votes = project.vote_set.filter(active=True)
    vote_distribution = votes.values('vote').annotate(count=Count('vote')).order_by('vote')
    
    # Évolution temporelle des votes
    vote_timeline = []
    for vote in votes.order_by('created_at'):
        vote_timeline.append({
            'date': vote.created_at.strftime('%Y-%m-%d'),
            'vote': vote.vote,
            'cumulative_count': votes.filter(created_at__lte=vote.created_at).count()
        })
    
    # Revenus générés
    total_revenue = VotePayment.objects.filter(
        vote__project=project, status='paye'
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    data = {
        'project': ProjectDetailSerializer(project).data,
        'vote_stats': {
            'total_votes': votes.count(),
            'average_rating': project.average_rating(),
            'distribution': list(vote_distribution),
            'timeline': vote_timeline
        },
        'revenue_stats': {
            'total_revenue': float(total_revenue),
            'revenue_per_vote': float(total_revenue / votes.count()) if votes.count() > 0 else 0
        },
        'recent_votes': VoteSerializer(
            votes.order_by('-created_at')[:10], many=True
        ).data
    }
    
    return Response(data, status=status.HTTP_200_OK)


# === ACTIONS EN LOT (BULK) ===
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminOrReadOnly])
def bulk_project_action(request):
    """Actions en lot sur les projets (Admin seulement)"""
    
    project_ids = request.data.get('project_ids', [])
    action = request.data.get('action')  # 'validate', 'reject', 'publish'
    comment = request.data.get('comment', '')
    
    if not project_ids or not action:
        return Response(
            {"error": "project_ids et action sont requis"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    valid_actions = ['validate', 'reject', 'publish', 'unpublish']
    if action not in valid_actions:
        return Response(
            {"error": f"Action invalide. Actions valides: {valid_actions}"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Mapper les actions aux statuts
    action_status_map = {
        'validate': 'valide',
        'reject': 'rejete',
        'publish': 'publie',
        'unpublish': 'desactive'
    }
    
    new_status = action_status_map[action]
    
    # Effectuer l'action en lot
    projects = Project.objects.filter(project_id__in=project_ids)
    updated_count = 0
    
    for project in projects:
        old_status = project.platform_status
        project.platform_status = new_status
        project.admin_comment = comment
        
        if new_status == 'valide' and old_status != 'valide':
            project.validated_at = timezone.now()
        
        project.save()
        updated_count += 1
    
    return Response({
        "message": f"{updated_count} projets mis à jour avec succès",
        "action": action,
        "new_status": new_status,
        "updated_count": updated_count
    }, status=status.HTTP_200_OK)
    
    