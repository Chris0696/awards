from django.contrib import admin
from .models import Project, Vote, Category, Commercial


class ProjectAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('project_title',)}
    list_display = ('project_title', 'category', 'owner', 'estimated_budget', 'owner_project_status', 'platform_status', 'updated_at')
    search_fields = ('project_title', 'category__name', 'owner__full_name', 'estimated_budget')
    list_filter = ('owner_project_status',)

class CommercialAdmin(admin.ModelAdmin):
    list_display = ('user', 'commission_rate', 'affiliate_code', 'phone', 'is_active', 'created_at')
    search_fields = ('full_name',)
    list_filter = ('affiliate_code',)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_name', 'active', 'slug')
    search_fields = ('category_name', 'owner__full_name')
    prepopulated_fields = {'slug': ('category_name',)}


class VoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'project', 'vote', 'active', 'created_at')


# class NotificationAdmin(admin.ModelAdmin):
#     list_display = ('user', 'teacher', 'order_item', 'seen', 'type', 'vote', 'date')


# class WishListAdmin(admin.ModelAdmin):
#     list_display = ('project', 'user')


admin.site.register(Project, ProjectAdmin)

admin.site.register(Category, CategoryAdmin)

admin.site.register(Vote, VoteAdmin)

admin.site.register(Commercial, CommercialAdmin)

# admin.site.register(WishList, WishListAdmin)