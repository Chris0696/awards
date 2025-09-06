
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from rest_framework.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _
import logging

logger = logging.getLogger(__name__)

class CustomJWTAuthentication(JWTAuthentication):
    """
    Authentification JWT personnalisée avec messages d'erreur améliorés
    """
    
    def authenticate(self, request):
        try:
            # Appeler la méthode d'authentification parente
            result = super().authenticate(request)
            
            if result is None:
                # Vérifier si un header Authorization est présent
                auth_header = self.get_header(request)
                if auth_header is None:
                    # Pas de header Authorization - retourner None (pas d'erreur)
                    # Cela permet aux vues avec permission_classes=[] de fonctionner
                    return None
                
                # Header présent mais token invalide
                raw_token = self.get_raw_token(auth_header)
                if raw_token is None:
                    raise AuthenticationFailed(
                        _("Format d'en-tête Authorization invalide. Utilisez: Bearer <token>")
                    )
                
                # Token présent mais invalide
                raise AuthenticationFailed(
                    _("Token invalide ou expiré, veuillez vous reconnecter.")
                )
            
            user, validated_token = result
            
            # Log pour monitoring (optionnel)
            logger.debug(f"User {user.id} authenticated successfully with JWT")
            
            return user, validated_token
            
        except TokenError as e:
            # Gestion spécifique des erreurs de token
            error_message = str(e).lower()
            
            if "expired" in error_message:
                raise AuthenticationFailed(
                    _("Token expiré, veuillez rafraîchir votre token ou vous reconnecter."),
                    code='token_expired'
                )
            elif "blacklisted" in error_message:
                raise AuthenticationFailed(
                    _("Token blacklisté, veuillez vous reconnecter."),
                    code='token_blacklisted'
                )
            elif "invalid" in error_message:
                raise AuthenticationFailed(
                    _("Token invalide, veuillez vous reconnecter."),
                    code='token_invalid'
                )
            else:
                raise AuthenticationFailed(
                    _("Erreur d'authentification, veuillez vous reconnecter."),
                    code='token_error'
                )
                
        except AuthenticationFailed:
            # Re-lancer les AuthenticationFailed déjà personnalisées
            raise
            
        except Exception as e:
            # Log les erreurs inattendues
            logger.error(f"Unexpected authentication error: {str(e)}")
            raise AuthenticationFailed(
                _("Erreur d'authentification inattendue."),
                code='authentication_error'
            )