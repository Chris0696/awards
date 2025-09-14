from django.shortcuts import render
from userauths.serializers import AdminUserUpdateSerializer, ProfileSerializer
from userauths.models import Profile, User
from project.models import Commercial
from .serializers import CommercialSerializer, AdminCommercialRegisterSerializer
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.password_validation import validate_password
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import serializers



class CommercialListCreateView(generics.ListCreateAPIView):
    queryset = Commercial.objects.all()
    serializer_class = CommercialSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class CommercialDetailView(generics.RetrieveUpdateAPIView):
    queryset = Commercial.objects.all()
    serializer_class = CommercialSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    

# class AdminCommercialView(generics.GenericAPIView):
#     permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
#     serializer_class = AdminCommercialRegisterSerializer

#     def get_queryset(self):
#         return User.objects.filter(user_type__in=['admin', 'commercial'])

#     # GET: Lister tous les admins et commerciaux
#     def get(self, request, *args, **kwargs):
#         queryset = self.get_queryset()
#         users_data = []
        
#         for user in queryset:
#             data = {
#                 'id': user.id,
#                 'email': user.email,
#                 'full_name': user.full_name,
#                 'phone': user.phone,
#                 'user_type': user.user_type,
#                 'is_active': user.is_active
#             }
#             if user.user_type == 'commercial':
#                 try:
#                     commercial = user.commercial
#                     commercial_data = CommercialSerializer(commercial).data
#                     data.update({
#                         'commission_rate': commercial_data['commission_rate'],
#                         'affiliate_link': commercial_data['affiliate_link'],
#                         'total_projects': commercial_data['total_projects'],
#                         'total_published_projects': commercial_data['total_published_projects'],
#                         'total_rejected_projects': commercial_data['total_rejected_projects'],
#                         'total_votes': commercial_data['total_votes'],
#                         'total_revenue': commercial_data['total_revenue'],
#                         'commission_earned': commercial_data['commission_earned']
#                     })
#                 except Commercial.DoesNotExist:
#                     pass
#             users_data.append(data)

#         return Response(users_data)

#     # POST: Créer un nouvel admin ou commercial
#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
#         return Response({
#             'id': user.id,
#             'email': user.email,
#             'username': user.username,
#             'phone': user.phone,
#             'user_type': user.user_type
#         }, status=status.HTTP_201_CREATED)

#     # PUT: Mettre à jour complètement un utilisateur
#     def put(self, request, pk, *args, **kwargs):
#         user = get_object_or_404(User, pk=pk, user_type__in=['admin', 'commercial'])
#         serializer = self.get_serializer(user, data=request.data, partial=False)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)

#     # PATCH: Mettre à jour partiellement un utilisateur
#     def patch(self, request, pk, *args, **kwargs):
#         user = get_object_or_404(User, pk=pk, user_type__in=['admin', 'commercial'])
#         serializer = self.get_serializer(user, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)

#     # DELETE: Supprimer un utilisateur
#     def delete(self, request, pk, *args, **kwargs):
#         user = get_object_or_404(User, pk=pk, user_type__in=['admin', 'commercial'])
#         user.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


class AdminCommercialView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminCommercialRegisterSerializer

    def get_queryset(self):
        return User.objects.filter(user_type__in=['admin', 'commercial'])

    # GET: Lister tous les admins et commerciaux
    def get(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            users_data = []
            
            for user in queryset:
                data = {
                    'id': user.id,
                    'email': user.email,
                    'full_name': user.full_name,
                    'phone': user.phone,
                    'user_type': user.user_type,
                    'is_active': user.is_active
                }
                if user.user_type == 'commercial':
                    try:
                        commercial = user.commercial
                        commercial_data = CommercialSerializer(commercial).data
                        data.update({
                            'commission_rate': commercial_data['commission_rate'],
                            'affiliate_link': commercial_data['affiliate_link'],
                            'total_projects': commercial_data['total_projects'],
                            'total_published_projects': commercial_data['total_published_projects'],
                            'total_rejected_projects': commercial_data['total_rejected_projects'],
                            'total_votes': commercial_data['total_votes'],
                            'total_revenue': commercial_data['total_revenue'],
                            'commission_earned': commercial_data['commission_earned']
                        })
                    except Commercial.DoesNotExist:
                        pass
                users_data.append(data)

            return Response({
                'success': True,
                'message': _("Liste récupérée avec succès"),
                'data': users_data,
                'count': len(users_data)
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': _("Erreur lors de la récupération des données"),
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # POST: Créer un nouvel admin ou commercial
    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            return Response({
                'success': True,
                'message': _("Utilisateur créé avec succès"),
                'data': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'phone': user.phone,
                    'user_type': user.user_type
                }
            }, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            return Response({
                'success': False,
                'message': _("Erreur de validation"),
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': _("Erreur lors de la création de l'utilisateur"),
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # PUT: Mettre à jour complètement un utilisateur
    def put(self, request, pk, *args, **kwargs):
        try:
            user = get_object_or_404(User, pk=pk, user_type__in=['admin', 'commercial'])
            serializer = self.get_serializer(user, data=request.data, partial=False)
            serializer.is_valid(raise_exception=True)
            updated_user = serializer.save()
            
            return Response({
                'success': True,
                'message': _("Utilisateur mis à jour avec succès"),
                'data': serializer.data
            })
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': _("Utilisateur non trouvé")
            }, status=status.HTTP_404_NOT_FOUND)
        except serializers.ValidationError as e:
            return Response({
                'success': False,
                'message': _("Erreur de validation"),
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': _("Erreur lors de la mise à jour"),
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # PATCH: Mettre à jour partiellement un utilisateur
    def patch(self, request, pk, *args, **kwargs):
        try:
            user = get_object_or_404(User, pk=pk, user_type__in=['admin', 'commercial'])
            serializer = self.get_serializer(user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            updated_user = serializer.save()
            
            return Response({
                'success': True,
                'message': _("Utilisateur modifié avec succès"),
                'data': serializer.data
            })
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': _("Utilisateur non trouvé")
            }, status=status.HTTP_404_NOT_FOUND)
        except serializers.ValidationError as e:
            return Response({
                'success': False,
                'message': _("Erreur de validation"),
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': _("Erreur lors de la modification"),
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # DELETE: Supprimer un utilisateur
    def delete(self, request, pk, *args, **kwargs):
        try:
            user = get_object_or_404(User, pk=pk, user_type__in=['admin', 'commercial'])
            user_email = user.email  # Garder l'email pour le message
            user.delete()
            
            return Response({
                'success': True,
                'message': _("Utilisateur '{}' supprimé avec succès").format(user_email)
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': _("Utilisateur non trouvé")
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'message': _("Erreur lors de la suppression"),
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
# Ajoutez ces imports au début de votre fichier

# from rest_framework import viewsets, status, serializers


# class AdminCommercialViewSet(viewsets.ModelViewSet):
#     permission_classes = [AllowAny]
#     serializer_class = AdminUserListSerializer  # Serializer par défaut

#     def get_queryset(self):
#         """Toujours retourner des objets User"""
#         return User.objects.filter(
#             user_type__in=['admin', 'commercial']
#         ).select_related('commercial')

#     def get_object(self):
#         """Récupérer l'objet avec gestion d'erreur"""
#         try:
#             obj = super().get_object()
#             if obj is None:
#                 raise serializers.ValidationError("Objet non trouvé")
#             return obj
#         except Exception as e:
#             raise serializers.ValidationError(f"Erreur lors de la récupération de l'objet: {str(e)}")

#     def get_serializer_class(self):
#         """Retourne toujours une classe de serializer valide"""
#         try:
#             if self.action == 'create':
#                 return AdminCommercialCreateSerializer
#             elif self.action in ['update', 'partial_update']:
#                 # Vérifier si l'utilisateur est un commercial
#                 if hasattr(self, 'get_object'):
#                     try:
#                         obj = self.get_object()
#                         if obj and obj.user_type == 'commercial' and hasattr(obj, 'commercial'):
#                             return AdminCommercialUpdateSerializer
#                     except Exception:
#                         pass
#                 return AdminUserListSerializer
#             return AdminUserListSerializer
#         except Exception:
#             # En cas d'erreur, retourner le serializer par défaut
#             return AdminUserListSerializer

#     def list(self, request, *args, **kwargs):
#         """Lister tous les admins et commerciaux"""
#         try:
#             queryset = self.get_queryset()

#             # Filtres
#             user_type = request.query_params.get('user_type', None)
#             if user_type and user_type in ['admin', 'commercial']:
#                 queryset = queryset.filter(user_type=user_type)

#             search = request.query_params.get('search', None)
#             if search:
#                 queryset = queryset.filter(
#                     Q(full_name__icontains=search) |
#                     Q(email__icontains=search) |
#                     Q(username__icontains=search)
#                 )

#             active_only = request.query_params.get('active_only', None)
#             if active_only == 'true':
#                 queryset = queryset.filter(is_active=True)

#             serializer = self.get_serializer(queryset, many=True)
#             return Response({
#                 'count': queryset.count(),
#                 'results': serializer.data
#             })
#         except Exception as e:
#             return Response({
#                 'error': f'Erreur lors de la récupération des données: {str(e)}'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     def create(self, request, *args, **kwargs):
#         """Créer un admin ou commercial"""
#         try:
#             serializer = self.get_serializer(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             user = serializer.save()
            
#             return Response({
#                 'message': f'{user.get_user_type_display()} créé avec succès',
#                 'user': serializer.data
#             }, status=status.HTTP_201_CREATED)
#         except serializers.ValidationError as e:
#             return Response({
#                 'error': e.detail
#             }, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({
#                 'error': f'Erreur lors de la création: {str(e)}'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     def retrieve(self, request, *args, **kwargs):
#         try:
#             user = self.get_object()  # Récupère l'objet User
#         except User.DoesNotExist:
#             return Response({
#                 'error': 'Utilisateur non trouvé'
#             }, status=status.HTTP_404_NOT_FOUND)

#         if user.user_type == 'commercial':
#             try:
#                 commercial = user.commercial
#                 serializer = AdminCommercialDetailSerializer(user, context={'request': request})
#                 return Response(serializer.data)
#             except Commercial.DoesNotExist:
#                 return Response({
#                     'error': 'Profil commercial non trouvé pour cet utilisateur'
#                 }, status=status.HTTP_404_NOT_FOUND)
#         else:
#             serializer = AdminUserListSerializer(user, context={'request': request})
#             return Response(serializer.data)

#     def update(self, request, *args, **kwargs):
#         """Mettre à jour un utilisateur"""
#         try:
#             partial = kwargs.pop('partial', False)
#             user = self.get_object()

#             if not user:
#                 return Response({
#                     'error': 'Utilisateur non trouvé'
#                 }, status=status.HTTP_404_NOT_FOUND)

#             if user.user_type == 'commercial' and hasattr(user, 'commercial'):
#                 # Mettre à jour les données commerciales
#                 commercial = user.commercial
#                 serializer = AdminCommercialUpdateSerializer(
#                     commercial, 
#                     data=request.data, 
#                     partial=partial, 
#                     context={'request': request}
#                 )
#             else:
#                 # Mettre à jour les données utilisateur simple
#                 serializer = AdminUserUpdateSerializer(
#                     user, 
#                     data=request.data, 
#                     partial=partial, 
#                     context={'request': request}
#                 )
            
#             serializer.is_valid(raise_exception=True)
#             serializer.save()
            
#             return Response({
#                 'message': 'Utilisateur mis à jour avec succès',
#                 'data': serializer.data
#             })
#         except serializers.ValidationError as e:
#             return Response({
#                 'error': e.detail
#             }, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({
#                 'error': f'Erreur lors de la mise à jour: {str(e)}'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     @action(detail=True, methods=['post'])
#     def toggle_active(self, request, pk=None):
#         """Activer/désactiver un utilisateur"""
#         try:
#             user = self.get_object()
            
#             if not user:
#                 return Response({
#                     'error': 'Utilisateur non trouvé'
#                 }, status=status.HTTP_404_NOT_FOUND)
            
#             if user.user_type == 'commercial' and hasattr(user, 'commercial'):
#                 # Pour les commerciaux, synchroniser User et Commercial
#                 commercial = user.commercial
#                 commercial.is_active = not commercial.is_active
#                 commercial.save()
                
#                 user.is_active = commercial.is_active
#                 user.save()
                
#                 return Response({
#                     'message': f'Commercial {"activé" if commercial.is_active else "désactivé"}',
#                     'is_active': commercial.is_active
#                 })
#             else:
#                 # Pour les admins
#                 user.is_active = not user.is_active
#                 user.save()
                
#                 return Response({
#                     'message': f'Utilisateur {"activé" if user.is_active else "désactivé"}',
#                     'is_active': user.is_active
#                 })
#         except Exception as e:
#             return Response({
#                 'error': f'Erreur lors du changement de statut: {str(e)}'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     @action(detail=True, methods=['post'])
#     def reset_password(self, request, pk=None):
#         """Réinitialiser le mot de passe"""
#         try:
#             user = self.get_object()
            
#             if not user:
#                 return Response({
#                     'error': 'Utilisateur non trouvé'
#                 }, status=status.HTTP_404_NOT_FOUND)
            
#             new_password = request.data.get('new_password')
            
#             if not new_password:
#                 return Response({
#                     'error': {
#                         'new_password': [_('Nouveau mot de passe requis')]
#                     }
#                 }, status=status.HTTP_400_BAD_REQUEST)

#             validate_password(new_password)
#             user.set_password(new_password)
#             user.save()
            
#             return Response({
#                 'message': _('Mot de passe réinitialisé avec succès')
#             })
#         except Exception as e:
#             return Response({
#                 'error': {
#                     'non_field_errors': [str(e)]
#                 }
#             }, status=status.HTTP_400_BAD_REQUEST)

#     @action(detail=False, methods=['get'])
#     def stats(self, request):
#         """Statistiques des admins et commerciaux"""
#         try:
#             total_admins = User.objects.filter(user_type='admin').count()
#             active_admins = User.objects.filter(user_type='admin', is_active=True).count()
#             total_commercials = Commercial.objects.count()
#             active_commercials = Commercial.objects.filter(is_active=True).count()

#             return Response({
#                 'admins': {
#                     'total': total_admins,
#                     'active': active_admins
#                 },
#                 'commercials': {
#                     'total': total_commercials,
#                     'active': active_commercials
#                 }
#             })
#         except Exception as e:
#             return Response({
#                 'error': f'Erreur lors de la récupération des statistiques: {str(e)}'
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)