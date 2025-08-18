from django.db import models
from userauths.models import User
from django.utils.translation import gettext_lazy as _


class Owner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to="course-file", blank=True, null=True, default="default.jpg")
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name=_("Téléphone"))
    profession = models.TextField(null=True, blank=True, verbose_name=_("Profession ou statut actuel"))
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.full_name
    
    class Meta:
        ordering = ['-created_at']
    
    def projects(self):
        return Project.objects.filter(owner=self)
    
    def vote(self):
        return Project.objects.filter(owner=self).count()