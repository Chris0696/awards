from django.contrib import admin
from .models import *


class OwnerAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'profession', 'country_code', 'phone', 'created_at')
    list_filter = ('full_name',)
    
admin.site.register(Owner, OwnerAdmin)
