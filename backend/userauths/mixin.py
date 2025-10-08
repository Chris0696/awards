from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

# class CustomErrorResponseMixin:
#     """
#     Mixin pour personnaliser le format des erreurs de validation.
#     Transforme les erreurs de validation en un format unifié :
#     {
#         "error": ["message1", "message2", ...]
#     }
#     """
    
#     def format_error_response(self, errors):
#         """
#         Formate les erreurs en une liste plate sous la clé 'error'
        
#         Args:
#             errors: Peut être un dict, une liste ou une chaîne
            
#         Returns:
#             dict: {"error": [liste des messages d'erreur]}
#         """
#         error_messages = []
        
#         if isinstance(errors, dict):
#             # Parcourir toutes les clés et extraire les messages
#             for field, messages in errors.items():
#                 if isinstance(messages, list):
#                     error_messages.extend([str(msg) for msg in messages])
#                 elif isinstance(messages, dict):
#                     # Pour les erreurs imbriquées
#                     nested_errors = self.format_error_response(messages)
#                     error_messages.extend(nested_errors.get('error', []))
#                 else:
#                     error_messages.append(str(messages))
#         elif isinstance(errors, list):
#             error_messages.extend([str(msg) for msg in errors])
#         else:
#             error_messages.append(str(errors))
        
#         return {"error": error_messages}
    
#     def handle_exception(self, exc):
#         """
#         Override de la méthode handle_exception pour intercepter les erreurs
#         """
#         if isinstance(exc, ValidationError):
#             formatted_errors = self.format_error_response(exc.detail)
#             return Response(
#                 formatted_errors,
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         # Pour les autres types d'exceptions, utiliser le comportement par défaut
#         return super().handle_exception(exc)
    
#     def create(self, request, *args, **kwargs):
#         """
#         Override de la méthode create pour gérer les erreurs de validation
#         """
#         serializer = self.get_serializer(data=request.data)
        
#         try:
#             serializer.is_valid(raise_exception=True)
#             return self.perform_create_with_response(serializer)
#         except ValidationError as e:
#             formatted_errors = self.format_error_response(e.detail)
#             return Response(
#                 formatted_errors,
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#         except Exception as e:
#             # Pour les erreurs non-validation
#             return Response(
#                 {"error": [str(e)]},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
    
#     def perform_create_with_response(self, serializer):
#         """
#         Méthode à surcharger dans les vues pour définir la logique métier
#         après la validation du serializer
#         """
#         raise NotImplementedError(
#             "Vous devez implémenter la méthode 'perform_create_with_response' "
#             "dans votre vue."
#         )

class CustomErrorResponseMixin:
    """
    Mixin pour personnaliser le format des erreurs de validation.
    Transforme les erreurs en un format unifié :
    {
        "error": ["message1", "message2", ...]
    }
    Avec la possibilité de personnaliser dynamiquement certains messages.
    """

    # 💡 Règles de personnalisation dynamiques :
    CUSTOM_MESSAGES = {
        "This password is too short": "Votre mot de passe est trop court. Il doit contenir au moins 8 caractères.",
        "Ensure this field has at least": "Ce champ doit contenir au moins 8 caractères.",
        "This field may not be blank": "Ce champ ne peut pas être vide.",
        "This field is required": "Ce champ est obligatoire.",
        "Enter a valid email address": "Veuillez entrer une adresse e-mail valide.",
        "password": "Le mot de passe doit contenir au moins 8 caractères, chiffres et lettres compris."
    }

    def format_error_response(self, errors):
        """
        Formate les erreurs en une liste plate sous la clé 'error'
        """
        error_messages = []

        if isinstance(errors, dict):
            for field, messages in errors.items():
                if isinstance(messages, list):
                    error_messages.extend([str(msg) for msg in messages])
                elif isinstance(messages, dict):
                    nested = self.format_error_response(messages)
                    error_messages.extend(nested.get("error", []))
                else:
                    error_messages.append(str(messages))
        elif isinstance(errors, list):
            error_messages.extend([str(msg) for msg in errors])
        else:
            error_messages.append(str(errors))

        # 🧠 Personnalisation dynamique des messages
        return {"error": [self._customize_message(msg) for msg in error_messages]}

    def _customize_message(self, msg: str) -> str:
        """
        Recherche dans les messages prédéfinis et remplace si une règle correspond.
        (Cela permet d'adapter les messages DRF ou Django à ton style)
        """
        for key, custom_msg in self.CUSTOM_MESSAGES.items():
            if key.lower() in msg.lower():
                return custom_msg
        return msg

    def handle_exception(self, exc):
        """
        Intercepte les erreurs ValidationError et applique la mise en forme
        """
        if isinstance(exc, ValidationError):
            formatted = self.format_error_response(exc.detail)
            return Response(formatted, status=status.HTTP_400_BAD_REQUEST)
        return super().handle_exception(exc)

    def create(self, request, *args, **kwargs):
        """
        Gère la création + validation + réponse d’erreurs personnalisées
        """
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            return self.perform_create_with_response(serializer)
        except ValidationError as e:
            formatted = self.format_error_response(e.detail)
            return Response(formatted, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": [str(e)]}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create_with_response(self, data):
        """
        Crée un objet via le serializer et renvoie une réponse standardisée.
        Compatible avec RegisterWithPaymentViewAPIView (data prétraitées).
        """
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        response_data = serializer.save()

        return Response({
            "success": True,
            "message": _("Inscription et soumission réussies"),
            'data': response_data
        }, status=status.HTTP_201_CREATED)
