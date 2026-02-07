import logging
import random
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string

from .models import User

logger = logging.getLogger(__name__)


def _is_email_configured():
    """Vérifie que l'envoi d'email est configuré (au moins from_email)."""
    return bool(getattr(settings, "DEFAULT_FROM_EMAIL", None))


def _send_email(to_emails, subject, body_text, body_html=None, fail_silently=True):
    """
    Envoie un email (texte + optionnel HTML).
    to_emails: liste d'adresses ou une seule adresse.
    """
    if not _is_email_configured():
        logger.warning("Email non envoyé: DEFAULT_FROM_EMAIL non configuré.")
        print("Email non envoyé: DEFAULT_FROM_EMAIL non configuré.")
        return False
    if isinstance(to_emails, str):
        to_emails = [to_emails]
    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=to_emails,
            body=body_text,
        )
        if body_html:
            msg.attach_alternative(body_html, "text/html")
        msg.send()
        logger.info("Email envoyé avec succès à %s (sujet: %s)", to_emails, subject)
        print(f"📧 Email envoyé à {to_emails} (sujet: {subject})")
        return True
    except Exception as e:
        logger.exception("Erreur envoi email: %s", e)
        if not fail_silently:
            raise
        return False


def generate_random_otp(length=7):
    while True:
        otp = ''.join([str(random.randint(0, 9)) for _ in range(length)])
        if not User.objects.filter(otp=otp).exists():
            return otp


def send_otp_email(user, otp_type, template_name, subject):
    """Envoie l'email de réinitialisation de mot de passe avec lien OTP."""
    from rest_framework_simplejwt.tokens import RefreshToken

    if not _is_email_configured():
        logger.warning("send_otp_email: DEFAULT_FROM_EMAIL non configuré, email non envoyé.")
        refresh = RefreshToken.for_user(user)
        refresh_token = str(refresh.access_token)
        user.refresh_token = refresh_token
        user.otp = generate_random_otp()
        user.save()
        link = f"{getattr(settings, 'FRONTEND_SITE_URL', '')}/{otp_type}/?otp={user.otp}&uuidb64={user.pk}&refresh_token={refresh_token}"
        return link

    refresh = RefreshToken.for_user(user)
    refresh_token = str(refresh.access_token)
    user.refresh_token = refresh_token
    user.otp = generate_random_otp()
    user.save()

    link = f"{settings.FRONTEND_SITE_URL}/{otp_type}/?otp={user.otp}&uuidb64={user.pk}&refresh_token={refresh_token}"
    context = {"link": link, "full_name": user.full_name or user.email}

    try:
        text_body = render_to_string(f"email/{template_name}.txt", context)
        html_body = render_to_string(f"email/{template_name}.html", context)
    except Exception as e:
        logger.exception("Template email %s introuvable ou erreur: %s", template_name, e)
        return link

    _send_email([user.email], subject, text_body, html_body, fail_silently=True)
    return link


# --- Formulaire de contact ---

def send_contact_notification_to_admin(contact_message):
    """Notifie l'admin qu'un nouveau message de contact a été reçu."""
    admin_email = getattr(settings, "ADMIN_EMAIL", None) or settings.DEFAULT_FROM_EMAIL
    if not admin_email:
        return False
    context = {
        "full_name": contact_message.full_name,
        "email": contact_message.email,
        "phone": contact_message.phone,
        "subject": contact_message.subject,
        "message": contact_message.message,
        "created_at": contact_message.created_at,
    }
    try:
        text_body = render_to_string("email/contact_admin.txt", context)
        html_body = render_to_string("email/contact_admin.html", context)
    except Exception as e:
        logger.exception("Template contact_admin: %s", e)
        return False
    subject = f"[Project Awards] Nouveau message: {contact_message.subject}"
    return _send_email([admin_email], subject, text_body, html_body)


def send_contact_confirmation_to_sender(contact_message):
    """Confirmation à l'expéditeur que son message a bien été reçu."""
    context = {"full_name": contact_message.full_name, "subject": contact_message.subject}
    try:
        text_body = render_to_string("email/contact_confirmation.txt", context)
        html_body = render_to_string("email/contact_confirmation.html", context)
    except Exception as e:
        logger.exception("Template contact_confirmation: %s", e)
        return False
    subject = "Nous avons bien reçu votre message - Project Awards"
    return _send_email([contact_message.email], subject, text_body, html_body)


# --- Inscription / bienvenue ---

def send_welcome_email(user_email, full_name):
    """Email de bienvenue après inscription."""
    context = {"full_name": full_name or user_email.split("@")[0]}
    try:
        text_body = render_to_string("email/welcome.txt", context)
        html_body = render_to_string("email/welcome.html", context)
    except Exception as e:
        logger.exception("Template welcome: %s", e)
        return False
    subject = "Bienvenue sur Project Awards"
    return _send_email([user_email], subject, text_body, html_body)


def send_project_submitted_confirmation(user_email, full_name, project_title=None):
    """Confirmation que la soumission de projet a bien été enregistrée."""
    context = {
        "full_name": full_name or user_email.split("@")[0],
        "project_title": project_title or "Votre projet",
    }
    try:
        text_body = render_to_string("email/project_submitted.txt", context)
        html_body = render_to_string("email/project_submitted.html", context)
    except Exception as e:
        logger.exception("Template project_submitted: %s", e)
        return False
    subject = "Votre projet a bien été soumis - Project Awards"
    return _send_email([user_email], subject, text_body, html_body)


# --- Validation / rejet projet ---

def send_project_validated_email(owner_email, full_name, project_title):
    """Notification au porteur que son projet a été validé."""
    context = {"full_name": full_name, "project_title": project_title}
    try:
        text_body = render_to_string("email/project_validated.txt", context)
        html_body = render_to_string("email/project_validated.html", context)
    except Exception as e:
        logger.exception("Template project_validated: %s", e)
        return False
    subject = f"Votre projet « {project_title} » a été validé - Project Awards"
    return _send_email([owner_email], subject, text_body, html_body)


def send_project_rejected_email(owner_email, full_name, project_title, admin_comment):
    """Notification au porteur que son projet a été rejeté (avec commentaire)."""
    context = {
        "full_name": full_name,
        "project_title": project_title,
        "admin_comment": admin_comment or "Aucun commentaire.",
    }
    try:
        text_body = render_to_string("email/project_rejected.txt", context)
        html_body = render_to_string("email/project_rejected.html", context)
    except Exception as e:
        logger.exception("Template project_rejected: %s", e)
        return False
    subject = f"Votre projet « {project_title} » - Project Awards"
    return _send_email([owner_email], subject, text_body, html_body)


# --- Vote ---

def send_vote_confirmation_email(voter_email, voter_name, project_title, vote_count, payment_reference=None):
    """Confirmation de vote au votant."""
    context = {
        "voter_name": voter_name or voter_email,
        "project_title": project_title,
        "vote_count": vote_count,
        "payment_reference": payment_reference or "",
    }
    try:
        text_body = render_to_string("email/vote_confirmation.txt", context)
        html_body = render_to_string("email/vote_confirmation.html", context)
    except Exception as e:
        logger.exception("Template vote_confirmation: %s", e)
        return False
    subject = f"Confirmation de votre vote - {project_title} - Project Awards"
    return _send_email([voter_email], subject, text_body, html_body)


# --- Création commercial (admin) ---

def send_commercial_welcome_email(user_email, full_name, password, affiliate_link):
    """Email au nouveau commercial : identifiants et lien d'affiliation."""
    context = {
        "full_name": full_name or user_email.split("@")[0],
        "user_email": user_email,
        "password": password,
        "affiliate_link": affiliate_link or "",
    }
    try:
        text_body = render_to_string("email/commercial_welcome.txt", context)
        html_body = render_to_string("email/commercial_welcome.html", context)
    except Exception as e:
        logger.exception("Template commercial_welcome: %s", e)
        return False
    subject = "Votre compte ambassadeur - Project Awards"
    return _send_email([user_email], subject, text_body, html_body)