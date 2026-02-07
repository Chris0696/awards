from django.shortcuts import render
from projectowner.models import Owner
from userauths.mixin import CustomErrorResponseMixin
from userauths.serializers import AdminUserUpdateSerializer, ProfileSerializer
from userauths.models import Profile, User
from project.models import AffiliateClick, Commercial
from .serializers import AffiliateClickSerializer, CommercialDetailSerializer, CommercialSerializer, AdminCommercialRegisterSerializer, CommercialStatsSerializer
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
from django.http import Http404


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

#     # GET: Lister tous les admins et ambassadeurs
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


# class AdminCommercialView(CustomErrorResponseMixin, generics.GenericAPIView):
#     permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
#     serializer_class = AdminCommercialRegisterSerializer

#     def get_queryset(self):
#         return User.objects.filter(user_type__in=['admin', 'commercial'])
    
#     def format_validation_errors(self, detail):
#         errors = []
#         if isinstance(detail, dict):
#             for _, messages in detail.items():
#                 if isinstance(messages, list):
#                     errors.extend(messages)
#                 else:
#                     errors.append(str(messages))
#         elif isinstance(detail, list):
#             errors = detail
#         else:
#             errors = [str(detail)]
#         return errors

#     # GET: Lister tous les admins et ambassadeurs
#     def get(self, request, *args, **kwargs):
#         try:
#             queryset = self.get_queryset()
#             users_data = []
            
#             for user in queryset:
#                 data = {
#                     'id': user.id,
#                     'email': user.email,
#                     'full_name': user.full_name,
#                     'phone': user.phone,
#                     'user_type': user.user_type,
#                     'is_active': user.is_active
#                 }
#                 if user.user_type == 'commercial':
#                     try:
#                         commercial = user.commercial
#                         commercial_data = CommercialSerializer(commercial).data
#                         data.update({
#                             'commission_rate': commercial_data['commission_rate'],
#                             'affiliate_link': commercial_data['affiliate_link'],
#                             'total_projects': commercial_data['total_projects'],
#                             'total_published_projects': commercial_data['total_published_projects'],
#                             'total_rejected_projects': commercial_data['total_rejected_projects'],
#                             'total_votes': commercial_data['total_votes'],
#                             'total_revenue': commercial_data['total_revenue'],
#                             'commission_earned': commercial_data['commission_earned']
#                         })
#                     except Commercial.DoesNotExist:
#                         pass
#                 users_data.append(data)

#             return Response({
#                 'success': True,
#                 'message': _("Liste récupérée avec succès"),
#                 'data': users_data,
#                 'count': len(users_data)
#             })
#         except Exception as e:
#             return Response({"error": self.format_validation_errors(e.detail)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     # POST: Créer un nouvel admin ou commercial
#     def post(self, request, *args, **kwargs):
#         try:
#             serializer = self.get_serializer(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             user = serializer.save()
            
#             return Response({
#                 'success': True,
#                 'message': _("Utilisateur créé avec succès"),
#                 'data': {
#                     'id': user.id,
#                     'email': user.email,
#                     'username': user.username,
#                     'phone': user.phone,
#                     'user_type': user.user_type
#                 }
#             }, status=status.HTTP_201_CREATED)
#         except serializers.ValidationError as e:
#             return Response({"error": self.format_validation_errors(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({"error": self.format_validation_errors(e.detail)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     # PUT: Mettre à jour complètement un utilisateur
#     def put(self, request, pk, *args, **kwargs):
#         try:
#             user = get_object_or_404(User, pk=pk, user_type__in=['admin', 'commercial'])
#             serializer = self.get_serializer(user, data=request.data, partial=False)
#             serializer.is_valid(raise_exception=True)
#             updated_user = serializer.save()
            
#             return Response({
#                 'success': True,
#                 'message': _("Utilisateur mis à jour avec succès"),
#                 'data': serializer.data
#             })
#         except User.DoesNotExist:
#             return Response({"error": self.format_validation_errors(e.detail)}, status=status.HTTP_404_NOT_FOUND)
#         except serializers.ValidationError as e:
#             return Response({"error": self.format_validation_errors(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({"error": self.format_validation_errors(e.detail)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     # PATCH: Mettre à jour partiellement un utilisateur
#     def patch(self, request, pk, *args, **kwargs):
#         try:
#             user = get_object_or_404(User, pk=pk, user_type__in=['admin', 'commercial'])
#             serializer = self.get_serializer(user, data=request.data, partial=True)
#             serializer.is_valid(raise_exception=True)
#             updated_user = serializer.save()
            
#             return Response({
#                 'success': True,
#                 'message': _("Utilisateur modifié avec succès"),
#                 'data': serializer.data
#             })
#         except User.DoesNotExist:
#             return Response({"error": self.format_validation_errors(e.detail)}, status=status.HTTP_404_NOT_FOUND)
#         except serializers.ValidationError as e:
#             return Response({"error": self.format_validation_errors(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({"error": self.format_validation_errors(e.detail)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     # DELETE: Supprimer un utilisateur
#     def delete(self, request, pk, *args, **kwargs):
#         try:
#             user = get_object_or_404(User, pk=pk, user_type__in=['admin', 'commercial'])
#             user_email = user.email  # Garder l'email pour le message
#             user.delete()
            
#             return Response({
#                 'success': True,
#                 'message': _("Utilisateur '{}' supprimé avec succès").format(user_email)
#             }, status=status.HTTP_200_OK)
#         except User.DoesNotExist:
#             return Response({"error": self.format_validation_errors(e.detail)}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             return Response({"error": self.format_validation_errors(e.detail)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminCommercialView(CustomErrorResponseMixin, generics.GenericAPIView):
    """
    Vue pour gérer les Admins et Ambassadeurs :
    - GET : Liste complète
    - POST : Création
    - PUT/PATCH : Mise à jour
    - DELETE : Suppression
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = AdminCommercialRegisterSerializer

    def get_queryset(self):
        return User.objects.filter(user_type__in=['admin', 'commercial'])

    # ✅ GET : Liste des utilisateurs
    def get(self, request, *args, **kwargs):
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
                commercial = getattr(user, 'commercial', None)
                if commercial:
                    commercial_data = CommercialSerializer(commercial).data
                    data.update({
                        'commercial_id': commercial.id,
                        'commission_rate': commercial_data['commission_rate'],
                        'affiliate_link': commercial_data['affiliate_link'],
                        'total_projects': commercial_data['total_projects'],
                        'total_published_projects': commercial_data['total_published_projects'],
                        'total_rejected_projects': commercial_data['total_rejected_projects'],
                        'total_votes': commercial_data['total_votes'],
                        'total_revenue': commercial_data['total_revenue'],
                        'commission_earned': commercial_data['commission_earned'],
                        'affiliates_count': Owner.objects.filter(commercial=commercial).count(),
                        'total_clicks': commercial_data['total_clicks'],
                    })

            users_data.append(data)

        return Response({
            "success": True,
            "message": _("Liste récupérée avec succès"),
            "count": len(users_data),
            "data": users_data
        }, status=status.HTTP_200_OK)

    # ✅ POST : Créer un nouvel admin ou commercial
    def perform_create_with_response(self, serializer):
        user = serializer.save()
        return Response({
            "success": True,
            "message": _("Utilisateur créé avec succès"),
            "data": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "phone": user.phone,
                "user_type": user.user_type
            }
        }, status=status.HTTP_201_CREATED)

    def post(self, request, *args, **kwargs):
        """
        On délègue la gestion d’erreurs au mixin.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return self.perform_create_with_response(serializer)

    # ✅ PUT / PATCH : Mise à jour
    def patch(self, request, pk, *args, **kwargs):
        user = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "success": True,
            "message": _("Utilisateur modifié avec succès"),
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request, pk, *args, **kwargs):
        user = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = self.get_serializer(user, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "success": True,
            "message": _("Utilisateur mis à jour avec succès"),
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    # ✅ DELETE : Suppression
    def delete(self, request, pk, *args, **kwargs):
        user = get_object_or_404(self.get_queryset(), pk=pk)
        email = user.email
        user.delete()

        return Response({
            "success": True,
            "message": _("Utilisateur '{}' supprimé avec succès").format(email)
        }, status=status.HTTP_200_OK)    


class AdminCommercialDetailView(generics.RetrieveAPIView):
    """
    Vue pour récupérer les détails d'un commercial avec ses filleuls
    Accepte soit commercial_id soit user_id
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = CommercialDetailSerializer
    queryset = Commercial.objects.all()
    lookup_field = 'pk'  # Par défaut cherche par commercial.id
    
    def get_object(self):
        """
        Récupère le commercial soit par son ID, soit par l'ID de son User
        """
        pk = self.kwargs.get('pk')
        
        # D'abord essayer de trouver par commercial.id
        try:
            return Commercial.objects.get(id=pk)
        except Commercial.DoesNotExist:
            pass
        
        # Si pas trouvé, essayer par user.id
        try:
            return Commercial.objects.get(user_id=pk)
        except Commercial.DoesNotExist:
            raise Http404(_("Commercial non trouvé"))
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            "success": True,
            "message": _("Détails du commercial récupérés avec succès"),
            "data": serializer.data
        }, status=status.HTTP_200_OK)
        
class TrackAffiliateClickView(generics.GenericAPIView):
    """
    Envoyer dans le body:
    {
        "affiliate_code": "COM_3179B372",
        "ip_address": "192.168.1.1",  // optionnel
        "user_agent": "Mozilla/5.0...",  // optionnel
        "referrer": "https://example.com"  // optionnel
    }
    """
    permission_classes = [AllowAny]  # Accessible sans authentification
    serializer_class = AffiliateClickSerializer 
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": _("Données invalides"),
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        affiliate_code = serializer.validated_data['affiliate_code']
        
        # Extraire le code si c'est une URL complète
        if 'affiliate=' in affiliate_code:
            affiliate_code = affiliate_code.split('affiliate=')[-1]
        
        # Trouver le commercial
        try:
            commercial = Commercial.objects.get(affiliate_link__contains=affiliate_code)
        except Commercial.DoesNotExist:
            return Response({
                "success": False,
                "message": _("Commercial non trouvé")
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Incrémenter le compteur
        commercial.increment_click()
        
        # Enregistrer le clic détaillé (optionnel)
        ip_address = serializer.validated_data.get('ip_address') or self.get_client_ip(request)
        user_agent = serializer.validated_data.get('user_agent') or request.META.get('HTTP_USER_AGENT', '')
        referrer = serializer.validated_data.get('referrer') or request.META.get('HTTP_REFERER', '')
        
        AffiliateClick.objects.create(
            commercial=commercial,
            ip_address=ip_address,
            user_agent=user_agent,
            referrer=referrer
        )
        
        return Response({
            "success": True,
            "message": _("Clic enregistré avec succès"),
            "data": {
                "commercial_id": commercial.id,
                "commercial_name": commercial.full_name,
                "total_clicks": commercial.total_clicks
            }
        }, status=status.HTTP_200_OK)
    
    def get_client_ip(self, request):
        """Récupère l'adresse IP du client"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class CommercialClickStatsView(generics.RetrieveAPIView):
    """
    Vue pour récupérer les statistiques de clics d'un commercial
    GET /api/commercial/<int:pk>/click-stats/
    """
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Commercial.objects.all()
    serializer_class = CommercialStatsSerializer

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
#         """Lister tous les admins et ambassadeurs"""
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
#                 # Pour les ambassadeurs, synchroniser User et Commercial
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
#         """Statistiques des admins et ambassadeurs"""
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