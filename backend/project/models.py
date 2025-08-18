from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from userauths.models import Profile, User
from projectowner.models import Owner
from django.db import models
from django.utils.text import slugify
from django.db.models.signals import post_save
from django.dispatch import receiver
from shortuuid.django_fields import ShortUUIDField


OWNER_STATUS = {
    (_("Brouillon"), _("Brouillon")),
    (_("Désactivé"), _("Désactivé")),
    (_("Publié"), _("Publié")),
}

PLATFORM_STATUS = {
    (_("Vote"), _("Vote")),
    (_("Brouillon"), _("Brouillon")),
    (_("Désactivé"), _("Désactivé")),
    (_("Rejecté"), _("Rejecté")),
    (_("Publié"), _("Publié")),
}


VOTE = {
    (1, "1 Vote"),
    (2, "2 Votes"),
    (3, "3 Votes"),
    (4, "4 Votes"),
    (5, "5 Votes"),
}

class Category(models.Model):
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE)
    category_name = models.CharField(max_length=100)
    image = models.FileField(upload_to="project-file", default="category.jpg", null=True, blank=True, verbose_name =_("Categorie"))
    active = models.BooleanField(default=True)
    slug = models.SlugField(unique=True, null=True, blank=True)

    class Meta:
        ordering = ['category_name']
        
    def clean(self):
        self.category_name = self.category_name.capitalize()

    def __str__(self):
        return f"{self.category_name}"

    def project_count(self):
        return Project.objects.filter(category=self).count()

    def save(self, *args, **kwargs):
        if self.slug == "" or self.slug == None:
            self.slug = slugify(self.title)
        super(Category, self).save(*args, **kwargs)
        

class Project(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="projectitems", verbose_name =_("Catégorie"))
    owner = models.ForeignKey(Owner, on_delete=models.CASCADE, verbose_name =_("Auteur du Projet"))
    file = models.FileField(upload_to="project-file", blank=True, null=True)
    image = models.FileField(upload_to="project-file", blank=True, null=True)
    local_area_impact = models.TextField(max_length=1500, null=True, blank=True, verbose_name =_("Zone géographique d'impact"))
    project_title = models.CharField(max_length=50, unique=True, verbose_name =_("Nom du projet"))
    slug = models.SlugField(unique=True, null=True, blank=True)
    main_objective = models.TextField(max_length=1500, null=True, blank=True, verbose_name =_("Objectif principal"))
    solution = models.TextField(max_length=1500, null=True, blank=True, verbose_name =_("Problème résolu par votre projet"))
    description = models.TextField(max_length=1500, null=True, blank=True, verbose_name =_("Description"))
    estimated_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name =_("Budget estimé"))
    platform_status = models.CharField(choices=PLATFORM_STATUS, default="Published", max_length=100)
    owner_project_status = models.CharField(choices=OWNER_STATUS, default="Published", max_length=100)
    featured = models.BooleanField(default=False, verbose_name =_("Projet en vedette"))
    projects_id = ShortUUIDField(unique=True, length=6, max_length=20, alphabet="1234567890")
    date = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.cours_title

    def save(self, *args, **kwargs):
        if self.slug == "" or self.slug == None:
            self.slug = slugify(self.owner + "-" + self.project_title) + "-" + str(self.projects_id)
        super(Project, self).save(*args, **kwargs)

    def average_rating(self):
        average_vote = Vote.objects.filter(project=self, active=True).aggregate(avg_rating=models.Avg('rating'))
        return round(average_vote['avg_rating'], 2) if average_vote['avg_rating'] else 0.0

    def Vote_count(self):
        return Vote.objects.filter(project=self, active=True).count()

    def votes(self):
        return Vote.objects.filter(project=self, active=True)
    

class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, verbose_name=_("Projet"))
    review = models.TextField()
    vote = models.IntegerField(choices=VOTE, default=None)
    reply = models.CharField(null=True, blank=True, max_length=1000, verbose_name=_("Réponse"))
    active = models.BooleanField(default=False)
    date = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return self.project.project_title

    def profile(self):
        return Profile.objects.get(user=self.user)

