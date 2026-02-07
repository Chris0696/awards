from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour permettre seulement aux propriétaires
    de modifier leurs objets.
    """
    def has_object_permission(self, request, view, obj):
        # Permissions de lecture pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permissions d'écriture seulement pour le propriétaire
        return obj.owner.user == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission pour les administrateurs seulement en écriture
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return request.user.is_staff or request.user.user_type == 'admin'


class IsCommercialOrAdmin(permissions.BasePermission):
    """
    Permission pour les ambassadeurs et administrateurs
    """
    def has_permission(self, request, view):
        return (request.user.user_type in ['commercial', 'admin'] or 
                request.user.is_staff)


class IsProjectOwner(permissions.BasePermission):
    """
    Permission pour le propriétaire du projet
    """
    def has_object_permission(self, request, view, obj):
        return obj.owner.user == request.user
