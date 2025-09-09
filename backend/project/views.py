from django.shortcuts import render

from userauths.permissions import IsAdminOrReadOnly
from commercial.serializers import CommercialSerializer
from projectowner.models import Owner
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import viewsets
from rest_framework.views import APIView


from django.utils.translation import gettext_lazy as _
from .models import Category, Commercial, Project, Vote, VotePayment, VotePrice
from .serializers import CategoryAdminSerializer, CategorySerializer, ProjectCreateUpdateSerializer, ProjectDetailSerializer, ProjectListSerializer, VoteAndPaySerializer, VotePriceSerializer, VoteSerializer, VotePaymentSerializer

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
        

# === VUES VOTE ===
        
class VoteCreateAPIView(generics.CreateAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.AllowAny]


class VoteListAPIView(generics.ListAPIView):
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    # filter_backends = [DjangoFilterBackend, OrderingFilter]
    # ordering_fields = ['created_at', 'vote', 'vote_count']
    # ordering = ['-created_at']
    # pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.user_type == 'admin':
            return Vote.objects.all().select_related('user', 'project')
        elif user.user_type == 'owner':
            try:
                owner = Owner.objects.get(user=user)
                return Vote.objects.filter(project__owner=owner).select_related('user', 'project')
            except Owner.DoesNotExist:
                return Vote.objects.none()
        return Vote.objects.none()  # Aucun vote visible pour les utilisateurs lambda
    
    
class VoteDetailAPIView(generics.RetrieveAPIView):  # Remplacer RetrieveUpdateAPIView par RetrieveAPIView
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.user_type == 'admin':
            return Vote.objects.all().select_related('user', 'project')
        elif user.user_type == 'owner':
            try:
                owner = Owner.objects.get(user=user)
                return Vote.objects.filter(project__owner=owner).select_related('user', 'project')
            except Owner.DoesNotExist:
                return Vote.objects.none()
        return Vote.objects.none()  # Aucun vote visible pour les utilisateurs lambda
        

class VotePriceListAPIView(generics.ListCreateAPIView):
    queryset = VotePrice.objects.all()
    serializer_class = VotePriceSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class VotePriceDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = VotePrice.objects.all()
    serializer_class = VotePriceSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class VotePaymentListAPIView(generics.ListAPIView):
    queryset = VotePayment.objects.all()
    serializer_class = VotePaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.user_type == 'admin':
            return VotePayment.objects.all()
        return VotePayment.objects.filter(user=user)


class VotePaymentCreateAPIView(generics.CreateAPIView):
    queryset = VotePayment.objects.all()
    serializer_class = VotePaymentSerializer
    permission_classes = [permissions.AllowAny]  # Peut être restreint à IsAuthenticated si nécessaire
    

class VoteAndPayAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VoteAndPaySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            result = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    