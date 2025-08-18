import random
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


def generate_random_otp(length=7):
    while True:
        otp = ''.join([str(random.randint(0, 9)) for _ in range(length)])
        if not User.objects.filter(otp=otp).exists():
            return otp
        

def send_otp_email(user, otp_type, template_name, subject):

    # Génère le token de rafraîchissement
    refresh = RefreshToken.for_user(user)
    refresh_token = str(refresh.access_token)
    user.refresh_token = refresh_token
    user.otp = generate_random_otp()
    user.save()

    # Génère le lien avec le type d'action
    link = f"{settings.FRONTEND_SITE_URL}/{otp_type}/?otp={user.otp}&uuidb64={user.pk}&refresh_token={refresh_token}"
    
    # # Prépare le contexte de l'email
    context = {
        "link": link,
        "username": user.username,
    }

    text_body = render_to_string(f"email/{template_name}.txt", context)
    html_body = render_to_string(f"email/{template_name}.html", context)

    msg = EmailMultiAlternatives(
        subject=subject,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
        body=text_body,
    )
    msg.attach_alternative(html_body, "text/html")
    msg.send()

    return link  # Pour vérification en mode debug