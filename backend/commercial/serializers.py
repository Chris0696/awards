
from rest_framework import serializers
from project.models import Commercial
from django.utils.translation import gettext_lazy as _
import re

class CommercialSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    total_projects = serializers.IntegerField(source='total_projects_brought', read_only=True)
    total_published_projects = serializers.IntegerField(read_only=True)
    total_rejected_projects = serializers.IntegerField(read_only=True)
    total_votes = serializers.IntegerField(source='total_votes_generated', read_only=True)
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2, source='total_revenue_generated', read_only=True)
    commission_earned = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Commercial
        fields = [
            'id', 'user_email', 'full_name', 'phone', 'commission_rate', 'affiliate_link',
            'is_active', 'created_at', 'total_projects', 'total_published_projects',
            'total_rejected_projects', 'total_votes', 'total_revenue', 'commission_earned'
        ]
        read_only_fields = ['affiliate_link', 'created_at']

    def validate_phone(self, value):
        if value and not re.match(r'^\d{7,15}$', value):
            raise serializers.ValidationError(_("Le numéro de téléphone doit contenir entre 7 et 15 chiffres."))
        return value

    def validate_commission_rate(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(_("Le taux de commission doit être compris entre 0 et 100%."))
        return value
    