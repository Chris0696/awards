from django.shortcuts import render
from api.serializers import AdminDashboardSerializer, OwnerDashboardSerializer
from project.serializers import ProjectAnalyticsVoteSerializer, ProjectListSerializer
from projectowner.models import Owner
from userauths.serializers import UserSerializer
from projectowner.serializers import OwnerSerializer
from userauths.permissions import IsAdminOrReadOnly
# from project.serializers import ProjectDetailSerializer, ProjectListSerializer, VoteSerializer
from commercial.serializers import CommercialSerializer
from project.models import Commercial, Project, Category, ProjectSubmissionPayment, User, Vote, VotePayment, VotePriceSettings
from django.db.models.expressions import Window
# from django.db.models.functions import Avg
from django.db.models.functions import Rank
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework import generics, permissions
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q, Sum, Count, Avg, F
from collections import defaultdict
import calendar


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
    """Analytiques détaillées d'un projet - Version adaptée au nouveau système"""
    
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
    
    # Évolution temporelle des votes avec revenus
    vote_timeline = []
    cumulative_votes = 0
    cumulative_revenue = 0
    
    for vote in votes.order_by('created_at'):
        cumulative_votes += vote.vote_count  # Nombre total de votes achetés
        
        # Récupérer le montant payé pour ce vote
        try:
            payment = VotePayment.objects.get(vote=vote, status='paye')
            vote_revenue = float(payment.amount)
            cumulative_revenue += vote_revenue
        except VotePayment.DoesNotExist:
            vote_revenue = 0
        
        vote_timeline.append({
            'date': vote.created_at.strftime('%Y-%m-%d %H:%M'),
            'vote_rating': vote.vote,
            'votes_bought': vote.vote_count,
            'revenue': vote_revenue,
            'cumulative_votes': cumulative_votes,
            'cumulative_revenue': cumulative_revenue
        })
    
    # Revenus détaillés
    paid_payments = VotePayment.objects.filter(
        vote__project=project, status='paye'
    )
    total_revenue = paid_payments.aggregate(total=Sum('amount'))['total'] or 0
    
    # Répartition par méthode de paiement
    payment_methods = paid_payments.values('payment_method').annotate(
        count=Count('id'),
        total=Sum('amount')
    )
    
    # Top votants (basé sur le nombre de votes achetés)
    top_voters = votes.values(
        'user__first_name', 'user__last_name', 'phone', 'country_code'
    ).annotate(
        total_votes=Sum('vote_count'),
        total_spent=Sum('votepayment__amount')
    ).order_by('-total_votes')[:10]
    
    # Votes par période (derniers 30 jours par jour)
    thirty_days_ago = timezone.now() - timedelta(days=30)
    daily_stats = []
    
    for i in range(30):
        date = thirty_days_ago + timedelta(days=i)
        date_start = date.replace(hour=0, minute=0, second=0, microsecond=0)
        date_end = date_start + timedelta(days=1)
        
        day_votes = votes.filter(created_at__range=[date_start, date_end])
        day_revenue = paid_payments.filter(
            created_at__range=[date_start, date_end]
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        daily_stats.append({
            'date': date.strftime('%Y-%m-%d'),
            'votes_count': day_votes.count(),
            'total_votes_bought': day_votes.aggregate(total=Sum('vote_count'))['total'] or 0,
            'revenue': float(day_revenue)
        })
    
    # Données de réponse
    data = {
        'project': {
            'id': project.project_id,
            'title': project.project_title,
            'status': project.platform_status,
            'created_at': project.created_at,
            'validated_at': project.validated_at,
            'featured': project.featured
        },
        'vote_stats': {
            'total_votes_transactions': votes.count(),  # Nombre de transactions
            'total_votes_bought': votes.aggregate(total=Sum('vote_count'))['total'] or 0,  # Votes achetés au total
            'average_rating': project.average_rating(),
            'rating_distribution': list(vote_distribution),
            'timeline': vote_timeline
        },
        'revenue_stats': {
            'total_revenue': float(total_revenue),
            'average_per_transaction': float(total_revenue / votes.count()) if votes.count() > 0 else 0,
            'current_vote_price': float(VotePriceSettings.get_vote_price()),
            'payment_methods': list(payment_methods)
        },
        'analytics': {
            'daily_stats': daily_stats,
            'top_voters': list(top_voters)
        },
        'recent_votes': ProjectAnalyticsVoteSerializer(
            votes.order_by('-created_at')[:20], many=True
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
    


# === DASHBOARD ADMINISTRATEUR ===

class AdminDashboardAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not request.user.is_staff and request.user.user_type != 'admin':
            return Response(
                {"error": _("Accès non autorisé")}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Statistiques générales
        project_stats = Project.objects.aggregate(
            total=Count('id'),
            validated=Count('id', filter=Q(platform_status='publie')),
            rejected=Count('id', filter=Q(platform_status='rejete')),
            pending=Count('id', filter=Q(platform_status='vote')),
            draft=Count('id', filter=Q(platform_status='brouillon'))
        )
        
        # Statistiques utilisateurs
        user_stats = {
            'total_users': User.objects.filter(is_active=True).count(),
            'total_owners': Owner.objects.count(),
            'total_commercials': Commercial.objects.filter(is_active=True).count(),
            'recent_users': User.objects.filter(date_joined__gte=timezone.now() - timedelta(days=30)).count()
        }
        
        # Statistiques votes
        vote_stats = {
            'total_votes': Vote.objects.filter(active=True).count(),
            'total_revenue': float(VotePayment.objects.filter(status='approved').aggregate(total=Sum('amount'))['total'] or 0),
            'pending_payments': VotePayment.objects.filter(status='en_attente').count(),
            'recent_votes': Vote.objects.filter(created_at__gte=timezone.now() - timedelta(days=30), active=True).count(),
        }
        vote_stats['average_revenue_per_vote'] = round(vote_stats['total_revenue'] / vote_stats['total_votes'], 2) if vote_stats['total_votes'] > 0 else 0
        
        # Activité récente
        recent_activity = {
            'recent_projects': Project.objects.filter(created_at__gte=timezone.now() - timedelta(days=30)).count(),
            'recent_votes': vote_stats['recent_votes'],
            'recent_users': user_stats['recent_users']
        }
        
        # Top catégories
        top_categories = Category.objects.annotate(project_count=Count('project')).order_by('-project_count')[:5]
        
        # Top commerciaux
        top_commercials = Commercial.objects.annotate(
            projects_brought=Count('project'),
            total_votes=Count('project__vote', filter=Q(project__vote__active=True))
        ).order_by('-projects_brought')[:5]
        
        data = {
            'general_stats': project_stats,
            'user_stats': user_stats,
            'vote_stats': vote_stats,
            'recent_activity': recent_activity,
            'top_categories': top_categories,
            'top_commercials': top_commercials
        }
        
        serializer = AdminDashboardSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

# === DASHBOARD OWNER (AUTEUR DE PROJET) ===
class OwnerDashboardAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.user_type != 'owner':
            return Response(
                {"error": _("Seul un utilisateur de type 'owner' peut accéder à ce tableau de bord.")},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            owner = Owner.objects.get(user=request.user)
        except Owner.DoesNotExist:
            return Response(
                {"error": _("Profil auteur non trouvé")},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Statistiques des projets
        project_stats = owner.project_set.aggregate(
            total=Count('id'),
            validated=Count('id', filter=Q(platform_status='publie')),
            rejected=Count('id', filter=Q(platform_status='rejete')),
            pending=Count('id', filter=Q(platform_status='vote')),
            draft=Count('id', filter=Q(platform_status='brouillon'))
        )
        project_stats['validation_rate'] = round(project_stats['validated'] / project_stats['total'] * 100, 2) if project_stats['total'] > 0 else 0
        
        # Statistiques des votes
        vote_stats = {
            'total_votes': Vote.objects.filter(project__owner=owner, active=True).count(),
            'average_rating': round(Vote.objects.filter(project__owner=owner, active=True).aggregate(avg=Avg('vote'))['avg'] or 0, 2),
            'total_revenue_generated': float(VotePayment.objects.filter(vote__project__owner=owner, status='approved').aggregate(total=Sum('amount'))['total'] or 0)
        }
        
        # Classement de l'Owner
        owner_votes = Owner.objects.annotate(
            total_votes=Count('project__vote', filter=Q(project__vote__active=True))
        ).order_by('-total_votes')
        owner_ranking = {
            'rank': None,
            'total_owners': owner_votes.count()
        }
        for index, ranked_owner in enumerate(owner_votes, start=1):
            if ranked_owner.id == owner.id:
                owner_ranking['rank'] = index
                break
        
        # Nombre de votes du premier projet
        top_project = Project.objects.annotate(
            vote_count=Count('vote', filter=Q(vote__active=True))
        ).order_by('-vote_count').first()
        top_project_votes = top_project.vote_count if top_project else 0
        
        # Projets récents avec rang
        all_projects = Project.objects.annotate(
            vote_count=Count('vote', filter=Q(vote__active=True)),
            rank=Window(
                expression=Rank(),
                order_by=F('vote_count').desc()
            )
        )
        recent_projects = owner.project_set.annotate(
            vote_count=Count('vote', filter=Q(vote__active=True)),
            rank=Window(
                expression=Rank(),
                order_by=F('vote_count').desc()
            )
        ).order_by('-created_at')[:5]
        
        # Votes récents reçus
        recent_votes = Vote.objects.filter(project__owner=owner, active=True).select_related('user', 'project').order_by('-created_at')[:10]
        
        data = {
            'profile': {
                'full_name': owner.full_name,
                'profession': owner.profession,
                'phone': owner.phone,
                'commercial': owner.commercial.full_name if owner.commercial else 'Aucun commercial associé'
            },
            'project_stats': project_stats,
            'vote_stats': vote_stats,
            'owner_ranking': owner_ranking,
            'top_project_votes': top_project_votes,
            'recent_projects': recent_projects,
            'recent_votes': recent_votes
        }
        
        serializer = OwnerDashboardSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)



# === DASHBOARD COMMERCIAL ===
class CommercialDashboardAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            commercial = Commercial.objects.get(user=request.user)
        except Commercial.DoesNotExist:
            return Response(
                {"error": "Profil commercial non trouvé"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Statistiques des projets amenés
        total_projects = commercial.total_projects_brought()
        validated_projects = commercial.total_validated_projects()
        rejected_projects = commercial.total_rejected_projects()
        pending_projects = Project.objects.filter(
            commercial=commercial, platform_status='vote'
        ).count()
        
        # Statistiques des votes et revenus
        total_votes = commercial.total_votes_generated()
        total_revenue = commercial.total_revenue_generated()
        commission_earned = commercial.commission_earned()
        
        # Auteurs amenés par ce commercial
        authors_brought = Owner.objects.filter(commercial=commercial).count()
        
        # Projets récents amenés
        recent_projects = Project.objects.filter(
            commercial=commercial
        ).select_related('owner', 'category').order_by('-created_at')[:10]
        
        # Performance mensuelle (6 derniers mois)
        monthly_stats = []
        for i in range(6):
            month_start = timezone.now().replace(day=1) - timedelta(days=30*i)
            month_end = month_start + timedelta(days=31)
            
            month_projects = Project.objects.filter(
                commercial=commercial,
                created_at__range=[month_start, month_end]
            ).count()
            
            month_votes = Vote.objects.filter(
                project__commercial=commercial,
                created_at__range=[month_start, month_end],
                active=True
            ).count()
            
            monthly_stats.append({
                'month': month_start.strftime('%m/%Y'),
                'projects': month_projects,
                'votes': month_votes
            })
        
        data = {
            'profile': {
                'full_name': commercial.full_name,
                'affiliate_code': commercial.affiliate_code,
                'commission_rate': float(commercial.commission_rate),
                'phone': commercial.phone,
                'is_active': commercial.is_active
            },
            'project_stats': {
                'total_projects_brought': total_projects,
                'validated_projects': validated_projects,
                'rejected_projects': rejected_projects,
                'pending_projects': pending_projects,
                'authors_brought': authors_brought,
                'validation_rate': round((validated_projects / total_projects * 100), 2) if total_projects > 0 else 0
            },
            'financial_stats': {
                'total_votes_generated': total_votes,
                'total_revenue_generated': float(total_revenue),
                'commission_earned': float(commission_earned),
                'commission_rate': float(commercial.commission_rate)
            },
            'recent_projects': [
                {
                    'id': p.project_id,
                    'title': p.project_title,
                    'owner': p.owner.full_name,
                    'category': p.category.category_name,
                    'status': p.platform_status,
                    'votes': p.vote_count(),
                    'created_at': p.created_at.strftime('%d/%m/%Y')
                } for p in recent_projects
            ],
            'monthly_performance': monthly_stats[::-1]  # Inverser pour avoir chronologique
        }
        
        return Response(data, status=status.HTTP_200_OK)



# === VUES POUR LA GESTION DES PROJETS (ADMIN) ===
class ProjectValidationAPIView(generics.UpdateAPIView):
    """Valider, rejeter ou modifier le statut d'un projet (Admin seulement)"""
    permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()
    lookup_field = 'project_id'
    
    def update(self, request, *args, **kwargs):
        if not request.user.is_staff and request.user.user_type != 'admin':
            return Response(
                {"error": "Accès non autorisé"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        project = self.get_object()
        new_status = request.data.get('platform_status')
        admin_comment = request.data.get('admin_comment', '')
        
        if new_status not in ['valide', 'rejete', 'vote', 'brouillon']:
            return Response(
                {"error": "Statut invalide"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        old_status = project.platform_status
        project.platform_status = new_status
        project.admin_comment = admin_comment
        
        if new_status == 'valide' and old_status != 'valide':
            project.validated_at = timezone.now()
        
        project.save()
        
        # Log de l'action admin (optionnel - vous pouvez créer un modèle AdminLog)
        
        return Response({
            "message": f"Projet {new_status} avec succès",
            "project_id": project.project_id,
            "new_status": new_status
        }, status=status.HTTP_200_OK)

#===========================LES GTRAPHIQUES ADMIN=================

@api_view(['GET'])
@permission_classes([IsAdminUser])
def votes_evolution_analytics(request):
    """
    API pour récupérer l'évolution des votes et revenus par année/mois/semaine
    Structure : {année: {mois: {semaines: [...], total_mois}, total_année}}
    """
    
    # Récupérer tous les votes actifs avec paiements approuvés
    votes_query = Vote.objects.filter(
        active=True,
        votepayment__status='approved'
    ).select_related('votepayment')
    
    # Structure de données pour organiser par année > mois > semaine
    analytics_data = defaultdict(lambda: {
        'months': defaultdict(lambda: {
            'weeks': [],
            'total_votes': 0,
            'total_revenue': 0
        }),
        'total_votes': 0,
        'total_revenue': 0
    })
    
    # Traiter chaque vote
    for vote in votes_query:
        created_date = vote.created_at
        year = created_date.year
        month = created_date.month
        
        # Calculer le numéro de la semaine dans le mois
        first_day_of_month = created_date.replace(day=1)
        week_in_month = ((created_date.day - 1) // 7) + 1
        
        # Ajouter aux totaux annuels
        analytics_data[year]['total_votes'] += vote.vote_count
        analytics_data[year]['total_revenue'] += float(vote.votepayment.amount)
        
        # Ajouter aux totaux mensuels
        analytics_data[year]['months'][month]['total_votes'] += vote.vote_count
        analytics_data[year]['months'][month]['total_revenue'] += float(vote.votepayment.amount)
        
        # Initialiser les semaines si nécessaire
        month_data = analytics_data[year]['months'][month]
        while len(month_data['weeks']) < week_in_month:
            month_data['weeks'].append({
                'week': len(month_data['weeks']) + 1,
                'total_votes': 0,
                'total_revenue': 0,
                'start_date': None,
                'end_date': None
            })
        
        # Ajouter aux données de la semaine
        week_index = week_in_month - 1
        month_data['weeks'][week_index]['total_votes'] += vote.vote_count
        month_data['weeks'][week_index]['total_revenue'] += float(vote.votepayment.amount)
        
        # Calculer les dates de début et fin de semaine
        if month_data['weeks'][week_index]['start_date'] is None:
            week_start = created_date - timedelta(days=created_date.weekday())
            week_start = max(week_start, first_day_of_month)  # Ne pas dépasser le début du mois
            
            # Fin de semaine : 6 jours après le début ou fin du mois
            week_end = week_start + timedelta(days=6)
            last_day_of_month = first_day_of_month.replace(
                day=calendar.monthrange(year, month)[1]
            )
            week_end = min(week_end, last_day_of_month)
            
            month_data['weeks'][week_index]['start_date'] = week_start.strftime('%Y-%m-%d')
            month_data['weeks'][week_index]['end_date'] = week_end.strftime('%Y-%m-%d')
    
    # Convertir en format JSON avec noms des mois
    formatted_data = {}
    for year, year_data in analytics_data.items():
        formatted_data[str(year)] = {
            'total_votes': year_data['total_votes'],
            'total_revenue': year_data['total_revenue'],
            'months': {}
        }
        
        for month, month_data in year_data['months'].items():
            month_name = calendar.month_name[month]
            formatted_data[str(year)]['months'][f"{month:02d}_{month_name}"] = {
                'month_number': month,
                'month_name': month_name,
                'total_votes': month_data['total_votes'],
                'total_revenue': month_data['total_revenue'],
                'weeks': month_data['weeks']
            }
    
    return Response({
        'success': True,
        'data': formatted_data,
        'summary': {
            'total_years': len(formatted_data),
            'total_votes_platform': sum(year['total_votes'] for year in formatted_data.values()),
            'total_revenue_platform': sum(year['total_revenue'] for year in formatted_data.values())
        }
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def projects_evolution_analytics(request):
    """
    API pour récupérer l'évolution des projets publiés par semaine et mois
    avec le nombre total de votes obtenus
    """
    
    # Récupérer tous les projets publiés
    projects_query = Project.objects.filter(
        platform_status='publie',
        validated_at__isnull=False
    ).prefetch_related('vote_set')
    
    # Structure pour organiser par année > mois > semaine
    projects_data = defaultdict(lambda: {
        'months': defaultdict(lambda: {
            'weeks': [],
            'total_projects': 0,
            'total_votes_received': 0
        }),
        'total_projects': 0,
        'total_votes_received': 0
    })
    
    # Traiter chaque projet
    for project in projects_query:
        validated_date = project.validated_at
        year = validated_date.year
        month = validated_date.month
        
        # Calculer le numéro de la semaine dans le mois
        week_in_month = ((validated_date.day - 1) // 7) + 1
        
        # Compter les votes reçus par ce projet
        project_votes = project.vote_set.filter(active=True).aggregate(
            total=Sum('vote_count')
        )['total'] or 0
        
        # Ajouter aux totaux annuels
        projects_data[year]['total_projects'] += 1
        projects_data[year]['total_votes_received'] += project_votes
        
        # Ajouter aux totaux mensuels
        projects_data[year]['months'][month]['total_projects'] += 1
        projects_data[year]['months'][month]['total_votes_received'] += project_votes
        
        # Initialiser les semaines si nécessaire
        month_data = projects_data[year]['months'][month]
        while len(month_data['weeks']) < week_in_month:
            month_data['weeks'].append({
                'week': len(month_data['weeks']) + 1,
                'total_projects': 0,
                'total_votes_received': 0,
                'average_votes_per_project': 0,
                'start_date': None,
                'end_date': None
            })
        
        # Ajouter aux données de la semaine
        week_index = week_in_month - 1
        month_data['weeks'][week_index]['total_projects'] += 1
        month_data['weeks'][week_index]['total_votes_received'] += project_votes
        
        # Calculer les dates de début et fin de semaine
        if month_data['weeks'][week_index]['start_date'] is None:
            first_day_of_month = validated_date.replace(day=1)
            week_start = validated_date - timedelta(days=validated_date.weekday())
            week_start = max(week_start, first_day_of_month)
            
            week_end = week_start + timedelta(days=6)
            last_day_of_month = first_day_of_month.replace(
                day=calendar.monthrange(year, month)[1]
            )
            week_end = min(week_end, last_day_of_month)
            
            month_data['weeks'][week_index]['start_date'] = week_start.strftime('%Y-%m-%d')
            month_data['weeks'][week_index]['end_date'] = week_end.strftime('%Y-%m-%d')
    
    # Calculer les moyennes pour chaque semaine et mois
    for year, year_data in projects_data.items():
        for month, month_data in year_data['months'].items():
            # Moyenne mensuelle
            if month_data['total_projects'] > 0:
                month_data['average_votes_per_project'] = round(
                    month_data['total_votes_received'] / month_data['total_projects'], 2
                )
            else:
                month_data['average_votes_per_project'] = 0
            
            # Moyennes hebdomadaires
            for week in month_data['weeks']:
                if week['total_projects'] > 0:
                    week['average_votes_per_project'] = round(
                        week['total_votes_received'] / week['total_projects'], 2
                    )
    
    # Formater les données
    formatted_data = {}
    for year, year_data in projects_data.items():
        # Moyenne annuelle
        year_average = 0
        if year_data['total_projects'] > 0:
            year_average = round(year_data['total_votes_received'] / year_data['total_projects'], 2)
        
        formatted_data[str(year)] = {
            'total_projects': year_data['total_projects'],
            'total_votes_received': year_data['total_votes_received'],
            'average_votes_per_project': year_average,
            'months': {}
        }
        
        for month, month_data in year_data['months'].items():
            month_name = calendar.month_name[month]
            formatted_data[str(year)]['months'][f"{month:02d}_{month_name}"] = {
                'month_number': month,
                'month_name': month_name,
                'total_projects': month_data['total_projects'],
                'total_votes_received': month_data['total_votes_received'],
                'average_votes_per_project': month_data['average_votes_per_project'],
                'weeks': month_data['weeks']
            }
    
    return Response({
        'success': True,
        'data': formatted_data,
        'summary': {
            'total_years': len(formatted_data),
            'total_projects_platform': sum(year['total_projects'] for year in formatted_data.values()),
            'total_votes_platform': sum(year['total_votes_received'] for year in formatted_data.values()),
            'platform_average': round(
                sum(year['total_votes_received'] for year in formatted_data.values()) /
                max(sum(year['total_projects'] for year in formatted_data.values()), 1), 2
            )
        }
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_summary_stats(request):
    """
    API pour les statistiques générales du tableau de bord
    """
    # Statistiques générales
    total_projects = Project.objects.filter(platform_status='publie').count()
    total_votes = Vote.objects.filter(active=True).count()
    total_vote_count = Vote.objects.filter(active=True).aggregate(
        total=Sum('vote_count')
    )['total'] or 0
    
    total_revenue_votes = VotePayment.objects.filter(
        status='approved'
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    total_revenue_projects = ProjectSubmissionPayment.objects.filter(
        status='approved'
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    total_users = User.objects.filter(user_type='owner').count()
    
    # Statistiques des 30 derniers jours
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    recent_projects = Project.objects.filter(
        platform_status='publie',
        validated_at__gte=thirty_days_ago
    ).count()
    
    recent_votes = Vote.objects.filter(
        active=True,
        created_at__gte=thirty_days_ago
    ).aggregate(total=Sum('vote_count'))['total'] or 0
    
    recent_revenue = VotePayment.objects.filter(
        status='approved',
        created_at__gte=thirty_days_ago
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    return Response({
        'success': True,
        'data': {
            'global_stats': {
                'total_projects_published': total_projects,
                'total_vote_transactions': total_votes,
                'total_votes_purchased': total_vote_count,
                'total_revenue_votes': float(total_revenue_votes),
                'total_revenue_projects': float(total_revenue_projects),
                'total_revenue': float(total_revenue_votes + total_revenue_projects),
                'total_users': total_users,
                'average_votes_per_project': round(total_vote_count / max(total_projects, 1), 2)
            },
            'last_30_days': {
                'new_projects': recent_projects,
                'new_votes': recent_votes,
                'revenue': float(recent_revenue)
            }
        }
    })
