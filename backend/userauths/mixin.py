from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError


class CustomErrorResponseMixin:
    """
    Mixin pour personnaliser le format des erreurs de validation.
    Transforme les erreurs de validation en un format unifié :
    {
        "error": ["message1", "message2", ...]
    }
    """
    
    def format_error_response(self, errors):
        """
        Formate les erreurs en une liste plate sous la clé 'error'
        
        Args:
            errors: Peut être un dict, une liste ou une chaîne
            
        Returns:
            dict: {"error": [liste des messages d'erreur]}
        """
        error_messages = []
        
        if isinstance(errors, dict):
            # Parcourir toutes les clés et extraire les messages
            for field, messages in errors.items():
                if isinstance(messages, list):
                    error_messages.extend([str(msg) for msg in messages])
                elif isinstance(messages, dict):
                    # Pour les erreurs imbriquées
                    nested_errors = self.format_error_response(messages)
                    error_messages.extend(nested_errors.get('error', []))
                else:
                    error_messages.append(str(messages))
        elif isinstance(errors, list):
            error_messages.extend([str(msg) for msg in errors])
        else:
            error_messages.append(str(errors))
        
        return {"error": error_messages}
    
    def handle_exception(self, exc):
        """
        Override de la méthode handle_exception pour intercepter les erreurs
        """
        if isinstance(exc, ValidationError):
            formatted_errors = self.format_error_response(exc.detail)
            return Response(
                formatted_errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Pour les autres types d'exceptions, utiliser le comportement par défaut
        return super().handle_exception(exc)
    
    def create(self, request, *args, **kwargs):
        """
        Override de la méthode create pour gérer les erreurs de validation
        """
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            return self.perform_create_with_response(serializer)
        except ValidationError as e:
            formatted_errors = self.format_error_response(e.detail)
            return Response(
                formatted_errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            # Pour les erreurs non-validation
            return Response(
                {"error": [str(e)]},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def perform_create_with_response(self, serializer):
        """
        Méthode à surcharger dans les vues pour définir la logique métier
        après la validation du serializer
        """
        raise NotImplementedError(
            "Vous devez implémenter la méthode 'perform_create_with_response' "
            "dans votre vue."
        )
