from django.contrib import admin
from .models import Project, Vote, Category


class ProjectAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('project_title',)}
    list_display = ('project_title', 'category', 'owner', 'estimated_budget', 'owner_project_status', 'platform_status', 'updated_at')
    search_fields = ('project_title', 'category__name', 'owner__full_name', 'estimated_budget')
    list_filter = ('owner_project_status',)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_name', 'active', 'owner', 'slug')
    search_fields = ('category_name', 'owner__full_name')
    prepopulated_fields = {'slug': ('category_name',)}


class VoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'project', 'vote', 'active', 'date')


# class NotificationAdmin(admin.ModelAdmin):
#     list_display = ('user', 'teacher', 'order_item', 'seen', 'type', 'vote', 'date')


# class WishListAdmin(admin.ModelAdmin):
#     list_display = ('project', 'user')


admin.site.register(Project, ProjectAdmin)

admin.site.register(Category, CategoryAdmin)

admin.site.register(Vote, VoteAdmin)

# admin.site.register(Notification, NotificationAdmin)

# admin.site.register(WishList, WishListAdmin)