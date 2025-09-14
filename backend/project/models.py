from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from django.conf import settings

from django.utils import timezone
from userauths.models import Profile, User
import uuid
from django.db import models
from django.utils.text import slugify
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Sum, Avg
from shortuuid.django_fields import ShortUUIDField
from django.utils.module_loading import import_string


OWNER_STATUS = (
    ("brouillon", _("Brouillon")),
    ("desactive", _("Désactivé")),
    ("publie", _("Publié")),
)

PLATFORM_STATUS = (
    ("brouillon", _("Brouillon")),
    ("desactive", _("Désactivé")),
    ("rejete", _("Rejeté")),
    ("publie", _("Publié")),
)

PAYMENT_STATUS = (
    ("en_attente", _("En attente")),
    ("paye", _("Payé")),
    ("echec", _("Échec")),
)

VOTE_CHOICES = (
    (1, _("1 Etoile")),
    (2, _("2 Etoiles")),
    (3, _("3 Etoiles")),
    (4, _("4 Etoiles")),
    (5, _("5 Etoiles")),
)


class Category(models.Model):
    category_name = models.CharField(max_length=100, unique=True)
    image = models.FileField(upload_to="categories", default="category.jpg", null=True, blank=True)
    active = models.BooleanField(default=True)
    slug = models.SlugField(unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    category_id = ShortUUIDField(unique=True, length=8, max_length=20, alphabet="1234567890ABCDEF")
    
    class Meta:
        ordering = ['category_name']
        verbose_name_plural = "Categories"
        
    def clean(self):
        self.category_name = self.category_name.capitalize()

    def __str__(self):
        return self.category_name

    def project_count(self):
        return self.project_set.count()
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.category_name)
        super().save(*args, **kwargs)
        
        
class Project(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name=_("Catégorie"))
    owner = models.ForeignKey('projectowner.Owner', on_delete=models.CASCADE, verbose_name=_("Auteur du Projet"))
    commercial = models.ForeignKey('project.Commercial', on_delete=models.SET_NULL, null=True, blank=True, 
                                 verbose_name=_("Commercial"))
    
    # Fichiers du projet
    
    file = models.FileField(upload_to="project-files", default="projectfile.jpg", blank=True, null=True)
    image = models.FileField(upload_to="project-images", default="project.jpg", blank=True, null=True)
    
    # Informations du projet
    project_title = models.CharField(max_length=200, verbose_name=_("Nom du projet"))
    slug = models.SlugField(unique=True, null=True, blank=True)
    local_area_impact = models.TextField(max_length=1500, null=True, blank=True, 
                                       verbose_name=_("Zone géographique d'impact"))
    main_objective = models.TextField(max_length=1500, null=True, blank=True, 
                                    verbose_name=_("Objectif principal"))
    solution = models.TextField(max_length=1500, null=True, blank=True, 
                              verbose_name=_("Problème résolu"))
    description = models.TextField(max_length=1500, null=True, blank=True, 
                                 verbose_name=_("Description"))
    estimated_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, 
                                         verbose_name=_("Budget estimé"))
    target_audience = models.TextField(max_length=500, null=True, blank=True, 
                                 verbose_name=_("Public cible"))
    progress_report = models.TextField(max_length=500, null=True, blank=True, 
                                 verbose_name=_("Etat d'avancement"))
    
    # Status et paramètres
    platform_status = models.CharField(choices=PLATFORM_STATUS, default="brouillon", max_length=100, verbose_name=_("L'admin défini sur :"))
    owner_project_status = models.CharField(choices=OWNER_STATUS, default="brouillon", max_length=100, verbose_name=_("L'auteur défini sur :"))
    featured = models.BooleanField(default=False, verbose_name=_("Projet en vedette"))
    
    # Identifiants et dates
    project_id = ShortUUIDField(unique=True, length=8, max_length=20, alphabet="1234567890ABCDEF")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    validated_at = models.DateTimeField(null=True, blank=True)
    
    # Commentaires admin
    admin_comment = models.TextField(blank=True, null=True, verbose_name=_("Commentaire admin"))

    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return self.project_title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.project_title}-{self.project_id}")
        
        # Mettre à jour validated_at si le statut change vers validé
        if self.platform_status == 'publie' and not self.validated_at:
            self.validated_at = timezone.now()
            
        super().save(*args, **kwargs)

    def average_rating(self):
        avg = self.vote_set.filter(active=True).aggregate(avg_rating=Avg('vote'))
        return round(avg['avg_rating'], 2) if avg['avg_rating'] else 0.0

    def vote_count(self):
        return self.vote_set.filter(active=True).count()
    
    def total_votes_revenue(self):
        """Revenus générés par les votes sur ce projet"""
        return VotePayment.objects.filter(vote__project=self, status='paye').aggregate(
            total=Sum('amount'))['total'] or 0


# class Commercial(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='commercial')
#     full_name = models.CharField(max_length=100, verbose_name=_("Nom et prénom"))
#     phone = models.CharField(max_length=20, blank=True, null=True, verbose_name=_("Téléphone"))
#     commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00, verbose_name=_("Taux de commission (%)"))
#     affiliate_link = models.CharField(max_length=200, unique=True, blank=True, verbose_name=_("Lien d'affiliation"))
#     is_active = models.BooleanField(default=True, verbose_name=_("Est actif"))
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     def __str__(self):
#         return f"Commercial: {self.full_name}"
    
#     def save(self, *args, **kwargs):
#         if not self.affiliate_link:
#             # Générer un identifiant unique pour le lien
#             affiliate_id = f"COM_{uuid.uuid4().hex[:8].upper()}"
#             # Construire le lien d'affiliation avec l'URL de base du site
#             base_url = getattr(settings, 'BASE_URL', settings.BASE_URL)
#             self.affiliate_link = f"{base_url}/api/v1/user/register/?affiliate={affiliate_id}"
#         super().save(*args, **kwargs)
    
#     def total_projects_brought(self):
#         """Nombre total de projets amenés par ce commercial"""
#         return Project.objects.filter(commercial=self).count()
    
#     def total_published_projects(self):
#         """Projets validés amenés par ce commercial"""
#         return Project.objects.filter(commercial=self, platform_status='publie').count()
    
#     def total_rejected_projects(self):
#         """Projets rejetés amenés par ce commercial"""
#         return Project.objects.filter(commercial=self, platform_status='rejete').count()
    
#     def total_votes_generated(self):
#         """Total des votes sur les projets amenés par ce commercial"""
#         return Vote.objects.filter(project__commercial=self, active=True).count()
    
#     def total_revenue_generated(self):
#         """Revenus générés par les votes sur ses projets"""
#         return VotePayment.objects.filter(
#             vote__project__commercial=self, 
#             status='paye'
#         ).aggregate(total=Sum('amount'))['total'] or 0
    
#     def commission_earned(self):
#         """Commission gagnée par le commercial"""
#         total_revenue = self.total_revenue_generated()
#         return (total_revenue * self.commission_rate) / 100

#     class Meta:
#         verbose_name = _("Commercial")
#         verbose_name_plural = _("Commerciaux")


class Commercial(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='commercial')
    full_name = models.CharField(max_length=100, verbose_name=_("Nom et prénom"))
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name=_("Téléphone"))
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00, verbose_name=_("Taux de commission (%)"))
    affiliate_link = models.CharField(max_length=200, unique=True, blank=True, verbose_name=_("Lien d'affiliation"))
    is_active = models.BooleanField(default=True, verbose_name=_("Est actif"))
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Commercial: {self.full_name}"
    
    def save(self, *args, **kwargs):
        if not self.affiliate_link:
            # Générer un identifiant unique pour le lien
            affiliate_id = f"COM_{uuid.uuid4().hex[:8].upper()}"
            # Construire le lien d'affiliation avec l'URL de base du site
            try:
                base_url = getattr(settings, 'BASE_URL', settings.BASE_URL)
                self.affiliate_link = f"{base_url}/api/v1/user/register/?affiliate={affiliate_id}"
            except Exception:
                base_url = getattr(settings, 'BASE_URL', 'http://localhost:8000')
                self.affiliate_link = f"{base_url}/api/v1/user/register/?affiliate={affiliate_id}"
        super().save(*args, **kwargs)
    
    def total_projects_brought(self):
        """Nombre total de projets amenés par ce commercial"""
        try:
            # Importation dynamique pour éviter les imports circulaires
            
            return Project.objects.filter(commercial=self).count()
        except Exception:
            return 0
    
    def total_published_projects(self):
        """Projets validés amenés par ce commercial"""
        try:
            
            return Project.objects.filter(commercial=self, platform_status='publie').count()
        except Exception:
            return 0
    
    def total_rejected_projects(self):
        """Projets rejetés amenés par ce commercial"""
        try:
            
            return Project.objects.filter(commercial=self, platform_status='rejete').count()
        except Exception:
            return 0
    
    def total_votes_generated(self):
        """Total des votes sur les projets amenés par ce commercial"""
        try:
            
            return Vote.objects.filter(project__commercial=self, active=True).count()
        except Exception:
            return 0
    
    def total_revenue_generated(self):
        """Revenus générés par les votes sur ses projets"""
        try:
            
            result = VotePayment.objects.filter(
                vote__project__commercial=self, 
                status='paye'
            ).aggregate(total=Sum('amount'))['total']
            return result or 0
        except Exception:
            return 0
    
    def commission_earned(self):
        """Commission gagnée par le commercial"""
        try:
            total_revenue = self.total_revenue_generated()
            return (total_revenue * self.commission_rate) / 100
        except Exception:
            return 0

    class Meta:
        verbose_name = _("Commercial")
        verbose_name_plural = _("Commerciaux")
    

class VotePriceSettings(models.Model):
    """Configuration globale des prix"""
    vote_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=100.00,
        verbose_name=_("Prix par vote")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _("Configuration globale")
        verbose_name_plural = _("Configurations globales")
    
    def __str__(self):
        return f"Prix par vote: {self.vote_price}"
    
    @classmethod
    def get_vote_price(cls):
        """Récupère le prix actuel d'un vote"""
        try:
            settings = cls.objects.first()
            return settings.vote_price if settings else 100.00
        except cls.DoesNotExist:
            return 100.00
        
        
class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, verbose_name=_("Projet"))
    vote = models.IntegerField(choices=VOTE_CHOICES, blank=True, null=True, verbose_name=_("Nombre d'étoile"))
    country_code = models.CharField(max_length=5, blank=True, null=True, verbose_name=_("Code pays")) 
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name=_("Téléphone"))
    active = models.BooleanField(default=False)  # Activé après paiement
    vote_count = models.IntegerField(default=1, verbose_name=_("Nombre de votes achetés"))
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Vote de {self.user or self.phone} pour {self.project.project_title} ({self.vote_count} votes, note: {self.vote})"

    def clean(self):
        import re
        if self.phone and not re.match(r'^\d{7,15}$', self.phone):
            raise models.ValidationError({"phone": _("Le numéro de téléphone doit contenir entre 7 et 15 chiffres.")})
        if self.country_code and not re.match(r'^\+\d{1,3}$', self.country_code):
            raise models.ValidationError({"country_code": _("Le code pays doit être au format + suivi de 1 à 3 chiffres (ex. +33).")})

    def profile(self):
        return Profile.objects.get(user=self.user) if self.user else None
    
    @property
    def total_price(self):
        """Calcule le prix total basé sur le nombre de votes"""
        return VotePriceSettings.get_vote_price() * self.vote_count
    

# class VotePrice(models.Model):
#     """Configuration des prix des votes"""
#     vote_count = models.IntegerField(unique=True, verbose_name=_("Nombre de votes"))
#     price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_("Prix"))
#     active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     class Meta:
#         ordering = ['vote_count']
    
#     def __str__(self):
#         return f"{self.vote_count} vote(s) - {self.price}€"
    
class VotePayment(models.Model):
    """Paiements pour les votes"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vote = models.OneToOneField(Vote, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='en_attente')
    payment_method = models.CharField(max_length=50, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Paiement {self.amount} - {self.status}"
    
    def save(self, *args, **kwargs):
        if self.status == 'paye' and not self.paid_at:
            self.paid_at = timezone.now()
        super().save(*args, **kwargs)

