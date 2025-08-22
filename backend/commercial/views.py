from django.shortcuts import render
from userauths.serializers import ProfileSerializer
from userauths.models import Profile, User
from project.models import Commercial
from commercial.serializers import CommercialSerializer
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView



class CommercialListCreateView(generics.ListCreateAPIView):
    queryset = Commercial.objects.all()
    serializer_class = CommercialSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class CommercialDetailView(generics.RetrieveUpdateAPIView):
    queryset = Commercial.objects.all()
    serializer_class = CommercialSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    


