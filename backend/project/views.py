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

    def create(self, request, *args, **kwargs):
        # Créer le vote
        vote_serializer = self.get_serializer(data=request.data)
        vote_serializer.is_valid(raise_exception=True)
        vote = vote_serializer.save()

        # Créer le paiement associé
        payment_data = {
            'vote_id': vote.id,
            'payment_method': request.data.get('payment_method', 'unknown')
        }
        payment_serializer = VotePaymentSerializer(data=payment_data, context={'request': request})
        payment_serializer.is_valid(raise_exception=True)
        payment = payment_serializer.save()

        # Retourner les détails du vote et du paiement
        return Response({
            'vote': vote_serializer.data,
            'payment': payment_serializer.data,
            'message': _("Vote créé, en attente de paiement.")
        }, status=status.HTTP_201_CREATED)


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
    

class CommercialListCreateView(generics.ListCreateAPIView):
    queryset = Commercial.objects.all()
    serializer_class = CommercialSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class CommercialDetailView(generics.RetrieveUpdateAPIView):
    queryset = Commercial.objects.all()
    serializer_class = CommercialSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
