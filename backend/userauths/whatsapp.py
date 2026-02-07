"""
Notifications WhatsApp via Twilio.
Envoi optionnel en parallèle des emails lorsque WHATSAPP_ENABLED et un numéro sont disponibles.
"""
import logging
import re
from django.conf import settings

logger = logging.getLogger(__name__)


def _is_whatsapp_configured():
    enabled = getattr(settings, "WHATSAPP_ENABLED", False)
    sid = getattr(settings, "TWILIO_ACCOUNT_SID", None) or ""
    token = getattr(settings, "TWILIO_AUTH_TOKEN", None) or ""
    from_ = getattr(settings, "TWILIO_WHATSAPP_FROM", None) or ""
    ok = bool(enabled and sid.strip() and token.strip() and from_.strip())
    if not ok and enabled:
        msg = f"WhatsApp activé mais config incomplète: SID={'ok' if sid.strip() else 'manquant'}, TOKEN={'ok' if token.strip() else 'manquant'}, FROM={'ok' if from_.strip() else 'manquant'}"
        logger.warning(msg)
        print(f"📱 {msg}")
    return ok


def _normalize_benin_national(raw_national):
    """
    Normalise la partie nationale pour le Bénin (+229).
    Convention locale: 01 XX XX XX XX → on enlève le "01", reste 8 chiffres (ex. 58187519).
    Ainsi l'admin peut saisir 01 58 18 75 19 et on envoie vers +22958187519.
    """
    if not raw_national or not raw_national.isdigit():
        return raw_national
    if raw_national.startswith("01") and len(raw_national) >= 10:
        return raw_national[2:]  # enlever "01" -> 8 chiffres
    if raw_national.startswith("0") and len(raw_national) >= 9:
        return raw_national[1:]  # enlever "0" (ex. 05... -> 5...)
    return raw_national


def normalize_phone_for_whatsapp(phone, country_code=None):
    """
    Retourne le numéro en E.164 (ex: +22958187519) ou None si invalide.
    Pour le Bénin (+229): l'admin peut saisir 01 58 18 75 19 ou +229 01 58 18 75 19,
    le backend enlève le "01" et envoie vers +22958187519.
    """
    if not phone or not str(phone).strip():
        return None
    raw = re.sub(r"[\s.\-()]", "", str(phone).strip())
    if not raw.isdigit() and not raw.startswith("+"):
        return None
    default_cc = (country_code or getattr(settings, "WHATSAPP_DEFAULT_COUNTRY_CODE", "+229")).strip()
    if not default_cc.startswith("+"):
        default_cc = "+" + default_cc.lstrip("0")

    if raw.startswith("+"):
        # Numéro avec indicatif
        cc_len = len(default_cc)  # ex. 4 pour "+229"
        if raw.startswith(default_cc) and len(raw) > cc_len:
            # Bénin: 01 XX XX XX XX → enlever "01", ex. +2290158187519 → +22958187519
            national = raw[cc_len:]
            national = _normalize_benin_national(national)
            raw = default_cc + national
        else:
            # Autre pays: enlever uniquement le 0 national en tête si présent (ex. +33123456789)
            if len(raw) > 4 and raw[4] == "0":
                raw = raw[:4] + raw[5:]
        return raw if len(raw) >= 10 else None

    # Numéro sans indicatif (ex. 01 58 18 75 19 ou 058187519)
    raw = _normalize_benin_national(raw)
    return default_cc + raw if len(raw) >= 7 else None


def _send_whatsapp(to_phone_e164, body_text, fail_silently=True):
    """Envoie un message WhatsApp via Twilio. to_phone_e164: ex. +2290158187519 (déjà normalisé)."""
    if not _is_whatsapp_configured():
        logger.warning("WhatsApp: envoi ignoré (config désactivée ou incomplète).")
        return False
    if not to_phone_e164:
        logger.warning("WhatsApp: numéro invalide ou manquant, envoi ignoré.")
        return False
    try:
        from twilio.rest import Client
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        from_ = (getattr(settings, "TWILIO_WHATSAPP_FROM") or "").strip()
        if not from_.startswith("whatsapp:"):
            from_ = "whatsapp:" + (from_ if from_.startswith("+") else "+" + from_)
        to = "whatsapp:" + (to_phone_e164 if to_phone_e164.startswith("+") else "+" + to_phone_e164)
        client.messages.create(body=body_text[:1600], from_=from_, to=to)
        logger.info("WhatsApp envoyé à %s", to_phone_e164)
        print(f"📱 WhatsApp envoyé à {to_phone_e164}")
        return True
    except Exception as e:
        err_msg = str(e)
        logger.exception("Erreur envoi WhatsApp: %s", e)
        # Log explicite pour Sandbox: le destinataire doit avoir rejoint le Sandbox Twilio
        if "21608" in err_msg or "not in" in err_msg.lower() or "sandbox" in err_msg.lower():
            logger.warning(
                "Twilio Sandbox: le destinataire doit envoyer 'join <votre-code>' au numéro Sandbox depuis WhatsApp pour recevoir les messages."
            )
        if not fail_silently:
            raise
        return False


# --- Messages courts (même contenu que les emails, version texte) ---

def send_welcome_whatsapp(phone, full_name, country_code=None):
    to = normalize_phone_for_whatsapp(phone, country_code) if phone else None
    if not to:
        return False
    body = f"Bonjour {full_name or 'vous'} ! Bienvenue sur Project Awards. Votre compte a été créé. Connectez-vous pour soumettre ou gérer vos projets."
    return _send_whatsapp(to, body)


def send_project_submitted_whatsapp(phone, full_name, project_title, country_code=None):
    to = normalize_phone_for_whatsapp(phone, country_code) if phone else None
    if not to:
        return False
    body = f"Bonjour {full_name or 'vous'} ! Votre projet « {project_title or 'projet'} » a bien été soumis et est en attente de validation. Vous serez notifié par email."
    return _send_whatsapp(to, body)


def send_contact_confirmation_whatsapp(phone, full_name, subject):
    to = normalize_phone_for_whatsapp(phone) if phone else None
    if not to:
        return False
    body = f"Bonjour {full_name} ! Nous avons bien reçu votre message (sujet: {subject}). Notre équipe vous répondra dans les meilleurs délais. - Project Awards"
    return _send_whatsapp(to, body)


def send_project_validated_whatsapp(phone, full_name, project_title, country_code=None):
    to = normalize_phone_for_whatsapp(phone, country_code) if phone else None
    if not to:
        return False
    body = f"Bonjour {full_name} ! Votre projet « {project_title} » a été validé et est publié sur Project Awards. - L'équipe Project Awards"
    return _send_whatsapp(to, body)


def send_project_rejected_whatsapp(phone, full_name, project_title, admin_comment, country_code=None):
    to = normalize_phone_for_whatsapp(phone, country_code) if phone else None
    if not to:
        return False
    comment = (admin_comment or "Aucun commentaire.")[:200]
    body = f"Bonjour {full_name}. Votre projet « {project_title} » ne peut pas être publié en l'état. Commentaire: {comment}. Vous pouvez le modifier et resoumettre. - Project Awards"
    return _send_whatsapp(to, body)


def send_vote_confirmation_whatsapp(phone, voter_name, project_title, vote_count):
    to = normalize_phone_for_whatsapp(phone) if phone else None
    if not to:
        return False
    body = f"Bonjour {voter_name} ! Merci pour votre vote. Votre vote pour « {project_title} » a bien été enregistré ({vote_count} vote(s)). - Project Awards"
    return _send_whatsapp(to, body)


def send_commercial_welcome_whatsapp(phone, full_name, user_email, password, affiliate_link):
    to = normalize_phone_for_whatsapp(phone) if phone else None
    if not to:
        print(f"📱 WhatsApp commercial: numéro non normalisable (reçu: {str(phone)[:4]}***)")
        return False
    body = (
        f"Bonjour {full_name} ! Votre compte commercial Project Awards a été créé. "
        f"Email: {user_email} | Mot de passe: {password}. "
        f"Lien d'affiliation: {affiliate_link or '—'}. "
        "Changez votre mot de passe après la 1ère connexion. - L'équipe Project Awards"
    )
    return _send_whatsapp(to, body)
