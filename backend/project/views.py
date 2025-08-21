from django.shortcuts import render

from commercial.serializers import CommercialSerializer
from projectowner.models import Owner
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter


from django.utils.translation import gettext_lazy as _
from .models import Commercial, Project, Vote, VotePayment, VotePrice
from .serializers import ProjectCreateUpdateSerializer, ProjectDetailSerializer, ProjectListSerializer, VotePriceSerializer, VoteSerializer, VotePaymentSerializer

from rest_framework.pagination import PageNumberPagination

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


# === SERIALIZERS PROJECT ===

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
        

class VoteCreateView(generics.CreateAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.AllowAny]


class VoteListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    ordering = ['-created_at']
    pagination_class = StandardResultsSetPagination
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return VoteSerializer
        return VoteSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        if user.is_staff or user.user_type == 'admin':
            return Vote.objects.all().select_related('user', 'project')
        elif user.user_type == 'owner':
            # Owner voit les votes sur ses projets
            try:
                owner = Owner.objects.get(user=user)
                return Vote.objects.filter(project__owner=owner).select_related('user', 'project')
            except Owner.DoesNotExist:
                return Vote.objects.none()
        else:
            # Utilisateurs voient leurs propres votes
            return Vote.objects.filter(user=user).select_related('project')


class VoteDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.is_staff or user.user_type == 'admin':
            return Vote.objects.all()
        else:
            # Utilisateurs ne peuvent voir que leurs votes
            return Vote.objects.filter(user=user)
        

class VotePriceListCreateView(generics.ListCreateAPIView):
    queryset = VotePrice.objects.all()
    serializer_class = VotePriceSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class VotePriceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VotePrice.objects.all()
    serializer_class = VotePriceSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class VotePaymentListView(generics.ListAPIView):
    queryset = VotePayment.objects.all()
    serializer_class = VotePaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.user_type == 'admin':
            return VotePayment.objects.all()
        return VotePayment.objects.filter(user=user)


class VotePaymentCreateView(generics.CreateAPIView):
    queryset = VotePayment.objects.all()
    serializer_class = VotePaymentSerializer
    permission_classes = [permissions.AllowAny]  # Peut être restreint à IsAuthenticated si nécessaire
    

class CommercialListCreateView(generics.ListCreateAPIView):
    queryset = Commercial.objects.all()
    serializer_class = CommercialSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class CommercialDetailView(generics.RetrieveUpdateAPIView):
    queryset = Commercial.objects.all()
    serializer_class = CommercialSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
