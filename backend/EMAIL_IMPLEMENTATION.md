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
