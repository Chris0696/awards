
from rest_framework import generics, status, permissions
from userauths.permissions import IsOwnerOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Owner, User
from .serializers import OwnerListSerializer, OwnerDetailSerializer, OwnerProfileSerializer, OwnerUpdateSerializer
from django.core.exceptions import ValidationError
from django.db.models import Count, Q


class IsAdminUser(permissions.BasePermission):
    """
    Permission personnalisée pour vérifier que l'utilisateur est admin
    """
    def has_permission(self, request, view):
        return (request.user and 
                request.user.is_authenticated and 
                (request.user.is_staff or request.user.is_superuser))


class OwnerListCreateAPIView(generics.ListCreateAPIView):
    """
    GET: Liste de tous les Owner (avec pagination et filtres)
    POST: Créer un nouveau Owner (optionnel pour admin)
    """
    queryset = Owner.objects.all().select_related('user', 'commercial')
    permission_classes = [IsAdminUser]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OwnerListSerializer
        return OwnerDetailSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtres optionnels
        user_type = self.request.query_params.get('user_type', None)
        commercial_id = self.request.query_params.get('commercial_id', None)
        has_projects = self.request.query_params.get('has_projects', None)
        search = self.request.query_params.get('search', None)
        
        if user_type:
            queryset = queryset.filter(user__user_type=user_type)
        
        if commercial_id:
            queryset = queryset.filter(commercial_id=commercial_id)
        
        if has_projects is not None:
            if has_projects.lower() == 'true':
                queryset = queryset.filter(project__isnull=False).distinct()
            elif has_projects.lower() == 'false':
                queryset = queryset.filter(project__isnull=True)
        
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search) |
                Q(user__email__icontains=search) |
                Q(user__username__icontains=search)
            ).distinct()
        
        return queryset.order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        """Liste paginée des Owner avec statistiques"""
        queryset = self.filter_queryset(self.get_queryset())
        
        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            result = self.get_paginated_response(serializer.data)
            
            # Ajouter des statistiques globales
            result.data['statistics'] = {
                'total_owners': Owner.objects.count(),
                'active_owners': Owner.objects.filter(user__is_active=True).count(),
                'owners_with_projects': Owner.objects.filter(project__isnull=False).distinct().count(),
                'owners_with_commercial': Owner.objects.filter(commercial__isnull=False).count()
            }
            return result
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'statistics': {
                'total_owners': Owner.objects.count(),
                'active_owners': Owner.objects.filter(user__is_active=True).count(),
                'owners_with_projects': Owner.objects.filter(project__isnull=False).distinct().count(),
                'owners_with_commercial': Owner.objects.filter(commercial__isnull=False).count()
            }
        })


class OwnerDetailAPIView(generics.RetrieveAPIView):
    """
    GET: Détail complet d'un Owner spécifique
    """
    queryset = Owner.objects.all().select_related('user', 'commercial').prefetch_related('project_set')
    serializer_class = OwnerDetailSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'id'
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        
        # Ajouter des statistiques spécifiques à ce Owner
        data['statistics'] = {
            'total_projects': instance.total_projects(),
            'published_projects': instance.published_projects(),
            'rejected_projects': instance.rejected_projects(),
            'pending_projects': instance.pending_projects(),
            'total_votes_received': instance.total_votes_received()
        }
        
        return Response(data)


class OwnerUpdateAPIView(generics.UpdateAPIView):
    """
    PATCH: Mise à jour partielle d'un Owner
    PUT: Mise à jour complète d'un Owner
    """
    queryset = Owner.objects.all().select_related('user')
    serializer_class = OwnerUpdateSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'id'
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Sauvegarder les données avant modification pour les logs
        old_data = {
            'full_name': instance.full_name,
            'user_active': instance.user.is_active,
            'commercial_id': instance.commercial.id if instance.commercial else None
        }
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        try:
            updated_instance = serializer.save()
            
            # Log de l'action (optionnel - vous pouvez créer un modèle de log)
            # self.log_admin_action(request.user, 'update_owner', instance, old_data, request.data)
            
            return Response({
                'message': 'Owner mis à jour avec succès',
                'owner': OwnerDetailSerializer(updated_instance).data
            })
            
        except ValidationError as e:
            return Response(
                {'error': 'Erreur de validation', 'details': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'Erreur lors de la mise à jour', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class OwnerDeleteAPIView(generics.DestroyAPIView):
    """
    DELETE: Suppression d'un Owner (et de son utilisateur associé)
    """
    queryset = Owner.objects.all().select_related('user')
    permission_classes = [IsAdminUser]
    lookup_field = 'id'
    
    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        owner_name = instance.full_name
        user_email = instance.user.email
        has_projects = instance.project_set.exists()
        
        # Vérifications avant suppression
        if has_projects:
            return Response(
                {
                    'error': 'Impossible de supprimer ce Owner',
                    'reason': "Il possède des projets. Supprimez d'abord ses projets ou transférez-les."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Sauvegarder les infos pour le log
            owner_data = {
                'id': instance.id,
                'full_name': owner_name,
                'email': user_email,
                'user_id': instance.user.id
            }
            
            # Supprimer l'utilisateur (cascade supprimera le Owner)
            user = instance.user
            user.delete()
            
            # Log de l'action (optionnel)
            # self.log_admin_action(request.user, 'delete_owner', None, owner_data, {})
            
            return Response(
                {
                    'message': f'Owner "{owner_name}" et son utilisateur associé ont été supprimés avec succès',
                    'deleted_data': owner_data
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {'error': 'Erreur lors de la suppression', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class OwnerToggleActiveAPIView(generics.UpdateAPIView):
    """
    PATCH: Activer/Désactiver un Owner (et son compte utilisateur)
    """
    queryset = Owner.objects.all().select_related('user')
    permission_classes = [IsAdminUser]
    lookup_field = 'id'
    
    @transaction.atomic
    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        current_status = instance.user.is_active
        new_status = not current_status
        
        # Mise à jour du statut
        instance.user.is_active = new_status
        instance.user.save()
        
        action = "activé" if new_status else "désactivé"
        
        return Response({
            'message': f'Owner "{instance.full_name}" a été {action} avec succès',
            'owner': {
                'id': instance.id,
                'full_name': instance.full_name,
                'email': instance.user.email,
                'is_active': new_status
            }
        })


# Optionnel: Vue pour les statistiques générales des Owner
class OwnerStatisticsAPIView(generics.GenericAPIView):
    """
    GET: Statistiques détaillées sur les Owner
    """
    permission_classes = [IsAdminUser]
    
    def get(self, request, *args, **kwargs):
        
        
        stats = {
            'general': {
                'total_owners': Owner.objects.count(),
                'active_owners': Owner.objects.filter(user__is_active=True).count(),
                'inactive_owners': Owner.objects.filter(user__is_active=False).count(),
            },
            'projects': {
                'owners_with_projects': Owner.objects.filter(project__isnull=False).distinct().count(),
                'owners_without_projects': Owner.objects.filter(project__isnull=True).count(),
            },
            'commercial': {
                'owners_with_commercial': Owner.objects.filter(commercial__isnull=False).count(),
                'owners_without_commercial': Owner.objects.filter(commercial__isnull=True).count(),
            },
            'by_month': list(
                Owner.objects.extra(
                    select={'month': 'EXTRACT(month FROM created_at)', 'year': 'EXTRACT(year FROM created_at)'}
                ).values('year', 'month').annotate(count=Count('id')).order_by('-year', '-month')[:12]
            ),
            'acceptance': {
                'accepted_reformulation': Owner.objects.filter(accept_project_reformulation=True).count(),
                'accepted_terms': Owner.objects.filter(accept_terms_of_use=True).count(),
            }
        }
        
        return Response(stats)
    
    
class UpdateOwnerProfileAPIView(APIView):
    
    permission_classes = [permissions.IsAuthenticated]

    def get_owner_object(self, user_id):
        """Récupère l'objet Owner basé sur l'user_id."""
        try:
            user = User.objects.get(id=user_id)
            return Owner.objects.get(user=user)
        except (User.DoesNotExist, Owner.DoesNotExist):
            return None

    def get(self, request, user_id):
        """Retourne le profil de l'owner correspondant à l'user_id."""
        owner = self.get_owner_object(user_id)
        if not owner:
            return Response({"error": "L'auteur n'est pas retrouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OwnerProfileSerializer(owner)
        return Response(serializer.data)

    def put(self, request, user_id):
        """Met à jour le profil de l'auteur correspondant à l'user_id."""
        owner = self.get_owner_object(user_id)
        if not owner:
            return Response({"error": "L'auteur n'est pas retrouvé"}, status=status.HTTP_404_NOT_FOUND)

        serializer = OwnerProfileSerializer(owner, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)