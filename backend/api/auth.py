
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        try:
            # Appeler la méthode d'authentification parente
            user, validated_token = super().authenticate(request)
            return user, validated_token
        except AuthenticationFailed as e:
            # Personnaliser le message d'erreur pour un token expiré
            if str(e).lower().find("expired") != -1:
                raise AuthenticationFailed(
                    _("Token expiré, veuillez rafraîchir ou vous reconnecter.")
                )
            raise e