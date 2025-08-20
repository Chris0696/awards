from .models import Profile, User
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .views import AccountActivationAPIView




# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)

# def save_user_profile(sender, instance, **kwargs):
#     instance.profile.save()

# post_save.connect(create_user_profile, sender=User)
# post_save.connect(save_user_profile, sender=User)