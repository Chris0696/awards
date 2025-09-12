from django.shortcuts import render
from userauths.serializers import ProfileSerializer
from userauths.models import Profile, User
from project.models import Commercial
from .serializers import AdminCommercialCreateSerializer, AdminCommercialUpdateSerializer, AdminUserListSerializer, CommercialSerializer
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.password_validation import validate_password
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils.translation import gettext_lazy as _

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action


# class CommercialListCreateView(generics.ListCreateAPIView):
#     queryset = Commercial.objects.all()
#     serializer_class = CommercialSerializer
#     permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


# class CommercialDetailView(generics.RetrieveUpdateAPIView):
#     queryset = Commercial.objects.all()
#     serializer_class = CommercialSerializer
#     permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    


class AdminCommercialViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        # Récupérer tous les utilisateurs admin et commercial
        return User.objects.filter(
            user_type__in=['admin', 'commercial']
        ).select_related('commercial')  # Changé de 'commercial_set' à 'commercial_profile'

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            obj = self.get_object()
            if isinstance(obj, User) and hasattr(obj, 'commercial'):
                return AdminCommercialUpdateSerializer
        # if self.action == 'create':
        #     return AdminCommercialCreateSerializer
        # elif self.action in ['update', 'partial_update']:
        #     obj = self.get_object()
        #     if isinstance(obj, Commercial):  # Vérifier directement si l'objet est Commercial
        #         return AdminCommercialUpdateSerializer
        # return AdminUserListSerializer  # Serializer par défaut pour list, retrieve, etc.


    def get_object(self):
        user = super().get_object()
        if self.action in ['update', 'partial_update', 'retrieve', 'destroy'] and user.user_type == 'commercial':
            try:
                return Commercial.objects.get(user=user)
            except Commercial.DoesNotExist:
                pass
        return user

    def list(self, request, *args, **kwargs):
        """Lister tous les admins et commerciaux"""
        queryset = self.get_queryset()

        # Filtres
        user_type = request.query_params.get('user_type', None)
        if user_type:
            queryset = queryset.filter(user_type=user_type)

        search = request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search) |
                Q(email__icontains=search) |
                Q(username__icontains=search)
            )

        active_only = request.query_params.get('active_only', None)
        if active_only == 'true':
            queryset = queryset.filter(is_active=True)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })

    def create(self, request, *args, **kwargs):
        """Créer un admin ou commercial"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'message': f'{user.get_user_type_display()} créé avec succès',
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """Activer/désactiver un utilisateur"""
        obj = self.get_object()
        if isinstance(obj, Commercial):
            obj.is_active = not obj.is_active
            obj.user.is_active = obj.is_active
            obj.user.save()
            obj.save()
            return Response({
                'message': f'Commercial {"activé" if obj.is_active else "désactivé"}',
                'is_active': obj.is_active
            })
        else:
            obj.is_active = not obj.is_active
            obj.save()
            return Response({
                'message': f'Utilisateur {"activé" if obj.is_active else "désactivé"}',
                'is_active': obj.is_active
            })

    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        """Réinitialiser le mot de passe"""
        obj = self.get_object()
        user = obj.user if isinstance(obj, Commercial) else obj
        new_password = request.data.get('new_password')
        if not new_password:
            return Response({
                'error': {
                    'new_password': [_('Nouveau mot de passe requis')]
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password)
            user.set_password(new_password)
            user.save()
            return Response({
                'message': _('Mot de passe réinitialisé avec succès')
            })
        except Exception as e:
            return Response({
                'error': {
                    'non_field_errors': [str(e)]
                }
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques des admins et commerciaux"""
        total_admins = User.objects.filter(user_type='admin').count()
        active_admins = User.objects.filter(user_type='admin', is_active=True).count()
        total_commercials = Commercial.objects.count()
        active_commercials = Commercial.objects.filter(is_active=True).count()

        return Response({
            'admins': {
                'total': total_admins,
                'active': active_admins
            },
            'commercials': {
                'total': total_commercials,
                'active': active_commercials
            }
        })