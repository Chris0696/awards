from django.contrib import admin
from userauths.models import ContactMessage, User, Profile
from django.contrib.auth.admin import UserAdmin


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'phone', 'profession', 'date')


class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'subject', 'message', 'phone')


class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'user_type', 'email', 'is_active')
    ordering = ('date_joined',)
    filter_horizontal = ()
    list_filter = ('username', 'user_type',)
    fieldsets = ()


admin.site.register(User, CustomUserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(ContactMessage, ContactMessageAdmin)
