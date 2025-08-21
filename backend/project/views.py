from django.shortcuts import render

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import gettext_lazy as _
from .models import Commercial, Project, Vote, VotePayment, VotePrice
from .serializers import CommercialSerializer, ProjectSerializer, VotePriceSerializer, VoteSerializer, VotePaymentSerializer


class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()
        

class VoteCreateView(generics.CreateAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.AllowAny]


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
