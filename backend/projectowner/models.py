from django.db import models
from project.models import Commercial, Vote
from userauths.models import Profile, User
from django.db.models import Sum, Avg

from django.utils.translation import gettext_lazy as _
import re


class Owner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to="owner-files", blank=True, null=True, default="default.jpg")
    profile = models.OneToOneField(Profile, related_name='owner_profile', on_delete=models.CASCADE, null=True, blank=True)
    full_name = models.CharField(max_length=100, verbose_name=_("Nom complet"))
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name=_("Téléphone"))
    country_code = models.CharField(max_length=5, blank=True, null=True, verbose_name=_("Code pays"))
    profession = models.TextField(null=True, blank=True, verbose_name=_("Profession"))
    age = models.PositiveIntegerField(null=True, blank=True, verbose_name=_("Âge"))
    commercial = models.ForeignKey(Commercial, on_delete=models.SET_NULL, null=True, blank=True, verbose_name=_("Commercial affilié"))
    accept_project_reformulation = models.BooleanField(
        default=False,
        verbose_name=_("J'accepte que mon projet soit reformulé par l'équipe Project Awards selon les critères du site.")
    )
    accept_terms_of_use = models.BooleanField(
        default=False,
        verbose_name=_("J'ai lu et j'accepte les conditions d'utilisation.")
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.profile.full_name if self.profile else self.user.full_name

    @property
    def get_image(self):
        """Retourne l'image du Profile en priorité, sinon celle d'Owner"""
        if self.profile and self.profile.image:
            return self.profile.image
        return self.image
    
    @property
    def get_full_name(self):
        """Retourne le nom du Profile en priorité"""
        if self.profile and self.profile.full_name:
            return self.profile.full_name
        return self.full_name
    
    @property
    def get_phone(self):
        """Retourne le téléphone du Profile en priorité"""
        if self.profile and self.profile.phone:
            return self.profile.phone
        return self.phone
    
    @property
    def get_profession(self):
        """Retourne la profession du Profile en priorité"""
        if self.profile and self.profile.profession:
            return self.profile.profession
        return self.profession
    
    def clean(self):
        # Valider le format du code pays (ex. + suivi de 1 à 3 chiffres)
        if self.country_code and not re.match(r'^\+\d{1,3}$', self.country_code):
            raise models.ValidationError({"country_code": _("Le code pays doit être au format + suivi de 1 à 3 chiffres (ex. +33).")})
        
        # Valider le format du numéro de téléphone (optionnel, chiffres uniquement)
        if self.phone and not re.match(r'^\d{7,15}$', self.phone):
            raise models.ValidationError({"phone": _("Le numéro de téléphone doit contenir entre 7 et 15 chiffres.")})
        
        # Valider l'âge (optionnel, entre 18 et 120 par exemple)
        if self.age and (self.age < 18 or self.age > 120):
            raise models.ValidationError({"age": _("L'âge doit être compris entre 18 et 120 ans.")})

    class Meta:
        ordering = ['-created_at']
    
    def total_projects(self):
        return self.project_set.filter(owner_project_status='publie').count()
    
    def published_projects(self):
        return self.project_set.filter(platform_status='publie').count()
    
    def rejected_projects(self):
        return self.project_set.filter(platform_status='rejete').count()
    
    def pending_projects(self):
        return self.project_set.filter(platform_status__in=['brouillon']).count()
    
    def total_votes_received(self):
        return Vote.objects.filter(project__owner=self, active=True).aggregate(total=Sum('vote_count'))['total'] or 0

# class Owner(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     image = models.FileField(upload_to="owner-files", blank=True, null=True, default="default.jpg")
#     full_name = models.CharField(max_length=100)
#     phone = models.CharField(max_length=20, blank=True, null=True, verbose_name=_("Téléphone"))
#     profession = models.TextField(null=True, blank=True, verbose_name=_("Profession"))
#     # commercial = models.ForeignKey(Commercial, on_delete=models.SET_NULL, null=True, blank=True, 
#     #                              verbose_name=_("Commercial parrain"))
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.full_name
    
#     class Meta:
#         ordering = ['-created_at']
    
#     def total_projects(self):
#         return self.project_set.count()
    
#     def validated_projects(self):
#         return self.project_set.filter(platform_status='valide').count()
    
#     def rejected_projects(self):
#         return self.project_set.filter(platform_status='rejete').count()
    
#     def pending_projects(self):
#         return self.project_set.filter(platform_status__in=['vote', 'brouillon']).count()
    
#     def total_votes_received(self):
#         return Vote.objects.filter(project__owner=self, active=True).count()
