# Envoi d’emails – Backend Awards (implémenté)

## Configuration (`awards/settings.py`)

- `EMAIL_BACKEND` : fallback `console` si non défini (emails en console en dev).
- `DEFAULT_FROM_EMAIL`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USE_TLS`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`.
- `ADMIN_EMAIL` : optionnel, pour les notifications admin (formulaire contact). Sinon = `DEFAULT_FROM_EMAIL`.

## Implémenté

| Cas | Fichier | Templates |
|-----|---------|-----------|
| Réinitialisation mot de passe | `userauths/utils.py` `send_otp_email`, `userauths/views.py` | `email/password_reset.*` |
| Formulaire contact : notification admin + confirmation expéditeur | `userauths/views.py` `ContactMessageListCreateView.perform_create` | `email/contact_admin.*`, `email/contact_confirmation.*` |
| Inscription : bienvenue + confirmation soumission projet | `api/serializers.py` `RegisterSerializer.create` | `email/welcome.*`, `email/project_submitted.*` |
| Projet validé / rejeté : email au porteur | `project/views.py` `validate_project`, `reject_project` | `email/project_validated.*`, `email/project_rejected.*` |
| Vote validé : confirmation au votant | `project/views.py` `VoteAndPaymentCreateAPIView.create` | `email/vote_confirmation.*` |
| Création commercial (admin) : identifiants + lien d'affiliation | `commercial/serializers.py` `AdminCommercialRegisterSerializer.create` | `email/commercial_welcome.*` |

## Optionnel `.env`

- `ADMIN_EMAIL` : adresse qui reçoit les nouveaux messages de contact (sinon = `DEFAULT_FROM_EMAIL`).

---

# Notifications WhatsApp (Twilio) – implémenté

Les mêmes cas que les emails envoient aussi un message WhatsApp **si** un numéro de téléphone est disponible et que WhatsApp est configuré.

## Configuration (`awards/settings.py`)

- `WHATSAPP_ENABLED` : `True` pour activer l’envoi WhatsApp (sinon les appels sont no-op).
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` : identifiants Twilio.
- `TWILIO_WHATSAPP_FROM` : numéro d’envoi au format `whatsapp:+14155238886` (ex. Sandbox Twilio).
- `WHATSAPP_DEFAULT_COUNTRY_CODE` : code pays par défaut si le numéro n’inclut pas le préfixe (ex. `+33`).

## Fichier d’envoi

- `userauths/whatsapp.py` : `_send_whatsapp`, `normalize_phone_for_whatsapp`, et les fonctions `send_*_whatsapp` (bienvenue, soumission projet, contact, projet validé/rejeté, vote, commercial).

## Où c’est appelé

| Cas | Fichier | Condition |
|-----|---------|-----------|
| Inscription + soumission projet | `api/serializers.py` `_send_registration_whatsapp` (après commit) | `phone` fourni à l’inscription |
| Confirmation contact | `userauths/views.py` `ContactMessageListCreateView.perform_create` | `contact_message.phone` |
| Projet validé / rejeté | `project/views.py` `validate_project`, `reject_project` | `owner.phone` |
| Vote validé | `project/views.py` `VoteAndPaymentCreateAPIView.create` | `vote.phone` |
| Création commercial | `commercial/serializers.py` `AdminCommercialRegisterSerializer.create` | `validated_data['phone']` |

## Optionnel `.env`

- `WHATSAPP_ENABLED=True`
- `TWILIO_ACCOUNT_SID=...`, `TWILIO_AUTH_TOKEN=...`
- `TWILIO_WHATSAPP_FROM=whatsapp:+14155238886`
- `WHATSAPP_DEFAULT_COUNTRY_CODE=+229`

Numéros au format E.164 (ex. `+22958187519`).

**Convention Bénin :** L’admin peut saisir le numéro comme au Bénin (`01 XX XX XX XX` ou `+229 01 XX XX XX XX`). Le backend enlève le préfixe « 01 » et envoie vers le bon E.164 (ex. `01 58 18 75 19` → `+22958187519`). Idem pour `05 XX XX XX XX` (le 0 national est retiré).

**Important – Twilio Sandbox :** Si vous utilisez le numéro Sandbox (`+14155238886`), chaque destinataire doit **une fois** envoyer un message WhatsApp au numéro Sandbox avec le texte indiqué dans la console Twilio (ex. `join <votre-code>`) pour pouvoir recevoir les messages. Sans cela, Twilio rejette l’envoi (erreur 21608). Consulter les logs du backend en cas de non-réception.
