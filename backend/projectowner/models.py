from django.db import models
from project.models import Vote
from userauths.models import User
from django.utils.translation import gettext_lazy as _


class Owner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to="owner-files", blank=True, null=True, default="default.jpg")
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name=_("Téléphone"))
    profession = models.TextField(null=True, blank=True, verbose_name=_("Profession"))
    # commercial = models.ForeignKey(Commercial, on_delete=models.SET_NULL, null=True, blank=True, 
    #                              verbose_name=_("Commercial parrain"))
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name
    
    class Meta:
        ordering = ['-created_at']
    
    def total_projects(self):
        return self.project_set.count()
    
    def validated_projects(self):
        return self.project_set.filter(platform_status='valide').count()
    
    def rejected_projects(self):
        return self.project_set.filter(platform_status='rejete').count()
    
    def pending_projects(self):
        return self.project_set.filter(platform_status__in=['vote', 'brouillon']).count()
    
    def total_votes_received(self):
        return Vote.objects.filter(project__owner=self, active=True).count()
