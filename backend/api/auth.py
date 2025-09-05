
# from rest_framework_simplejwt.authentication import JWTAuthentication
# from rest_framework.exceptions import AuthenticationFailed
# from django.utils.translation import gettext_lazy as _

# class CustomJWTAuthentication(JWTAuthentication):
#     def authenticate(self, request):
#         try:
#             # Appeler la méthode d'authentification parente
#             result = super().authenticate(request)
#             if result is None:
#                 # Gérer le cas où aucun token valide n'est fourni
#                 auth_header = request.headers.get('Authorization', '')
#                 if not auth_header or not auth_header.startswith('Bearer '):
#                     raise AuthenticationFailed(
#                         _("Aucun token fourni ou format d'en-tête invalide.")
#                     )
#                 raise AuthenticationFailed(
#                     _("Token invalide ou expiré, veuillez vous reconnecter.")
#                 )
#             user, validated_token = result
#             return user, validated_token
#         except AuthenticationFailed as e:
#             # Personnaliser le message pour un token expiré
#             if str(e).lower().find("expired") != -1:
#                 raise AuthenticationFailed(
#                     _("Token expiré, veuillez rafraîchir ou vous reconnecter.")
#                 )
#             raise e