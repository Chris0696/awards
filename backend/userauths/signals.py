from .models import Profile, User
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver


@receiver(post_save, sender=User)
def sync_user_and_profile(sender, instance, created, **kwargs):
    """
    Crée et synchronise automatiquement le Profile quand un User est créé/modifié
    """
    if created:
        # Récupérer les données de l'Owner si il existe déjà
        # (cas où Owner est créé avant que ce signal ne se déclenche)
        try:
            from projectowner.models import Owner
            owner = Owner.objects.get(user=instance)
            
            # Créer le Profile avec les données de l'Owner
            Profile.objects.create(
                user=instance,
                full_name=instance.full_name or instance.username,
                phone=owner.phone or instance.phone or '',
                profession=owner.profession or ''
            )
        except:
            # Si Owner n'existe pas encore, créer le Profile avec les données du User
            Profile.objects.create(
                user=instance,
                full_name=instance.full_name or instance.username,
                phone=instance.phone or ''
            )
    else:
        # Mettre à jour le Profile existant si le User est modifié
        try:
            profile = instance.profile
            updated = False
            
            if profile.full_name != instance.full_name:
                profile.full_name = instance.full_name
                updated = True
            
            if profile.phone != instance.phone:
                profile.phone = instance.phone
                updated = True
            
            if updated:
                profile.save()
                
        except Profile.DoesNotExist:
            # Créer le Profile si il n'existe pas
            Profile.objects.create(
                user=instance,
                full_name=instance.full_name or instance.username,
                phone=instance.phone or ''
            )


@receiver(post_save, sender='projectowner.Owner')
def sync_owner_to_profile(sender, instance, created, **kwargs):
    """
    Synchronise automatiquement les données de l'Owner vers le Profile
    """
    try:
        # Récupérer ou créer le Profile
        profile, profile_created = Profile.objects.get_or_create(
            user=instance.user,
            defaults={
                'full_name': instance.full_name,
                'phone': instance.phone,
                'profession': instance.profession
            }
        )
        
        # Si le Profile existait déjà, le mettre à jour
        if not profile_created:
            updated = False
            
            if profile.full_name != instance.full_name:
                profile.full_name = instance.full_name
                updated = True
            
            if profile.phone != instance.phone:
                profile.phone = instance.phone
                updated = True
            
            if profile.profession != instance.profession:
                profile.profession = instance.profession
                updated = True
            
            if updated:
                profile.save()
        
        # Associer le Profile à l'Owner
        if instance.profile != profile:
            instance.profile = profile
            # Utiliser update pour éviter de redéclencher le signal
            from projectowner.models import Owner
            Owner.objects.filter(pk=instance.pk).update(profile=profile)
            
    except Exception as e:
        print(f"Erreur sync Owner -> Profile: {e}")
