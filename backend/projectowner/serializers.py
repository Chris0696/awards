from project.serializers import CommercialSerializer
from userauths.serializers import UserSerializer
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import *


class OwnerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    commercial = CommercialSerializer(read_only=True)
    total_projects = serializers.SerializerMethodField()
    published_projects = serializers.SerializerMethodField()
    rejected_projects = serializers.SerializerMethodField()
    total_votes_received = serializers.SerializerMethodField()

    class Meta:
        model = Owner
        fields = [
            'id', 'user', 'image', 'full_name', 'phone', 'country_code', 'profession', 'age', 'commercial',
            'created_at', 'total_projects', 'published_projects', 'rejected_projects', 'total_votes_received'
        ]

    def get_total_projects(self, obj):
        return obj.total_projects()
    
    def get_published_projects(self, obj):
        return obj.published_projects()
    
    def get_rejected_projects(self, obj):
        return obj.published_projects()
    
    def get_total_votes_received(self, obj):
        return obj.total_votes_received()
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Formater les erreurs dans le style souhaité si nécessaire
        return data