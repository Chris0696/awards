from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

USER_TYPES = (
    ("admin", _("Administrateur")),
    ("owner", _("Auteur de projet")),
    ("commercial", _("Commercial")),
    ("user", _("Utilisateur")),
)


class User(AbstractUser):
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(
        unique=True,
        
    )
    full_name = models.CharField(max_length=100, verbose_name=_("Nom et Prénom"))
    phone = models.CharField(max_length=25, blank=True, null=True, unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default="user")
    otp = models.CharField(max_length=100, null=True, blank=True)
    refresh_token = models.CharField(max_length=1000, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        if not self.full_name:
            email_username = self.email.split("@")[0]
            self.full_name = email_username
        if not self.username:
            # Générer un username unique basé sur l'email
            base_username = self.email.split("@")[0]
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            self.username = username
        super(User, self).save(*args, **kwargs)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to="user_folder", default="default-user.jpg", null=True, blank=True)
    full_name = models.CharField(max_length=100, verbose_name=_("Nom et Prénom"))
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name=_("Téléphone"))
    profession = models.TextField(null=True, blank=True, verbose_name=_("Profession"))
    date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.full_name or self.user.full_name
        
    def save(self, *args, **kwargs):
        if not self.full_name:
            self.full_name = self.user.full_name
        super(Profile, self).save(*args, **kwargs)


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)