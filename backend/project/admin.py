from django.contrib import admin
from .models import Project, Vote, Category, Commercial, VotePayment, VotePriceSettings


class ProjectAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('project_title',)}
    list_display = ('project_title', 'category', 'owner', ('commercial'), 'estimated_budget', 'owner_project_status', 'platform_status', 'updated_at')
    search_fields = ('project_title', 'category__name', 'owner__full_name', 'estimated_budget')
    list_filter = ('owner_project_status',)

class CommercialAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'commission_rate', 'affiliate_link', 'phone', 'is_active', 'created_at')
    search_fields = ('full_name',)
    list_filter = ('full_name',)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_name', 'active', 'slug')
    search_fields = ('category_name', 'owner__full_name')
    prepopulated_fields = {'slug': ('category_name',)}


# class VoteAdmin(admin.ModelAdmin):
#     list_display = ('user', 'project', 'vote_count', 'vote', 'active', 'created_at')


class VotePriceSettingsAdmin(admin.ModelAdmin):
    list_display = ('vote_price', 'created_at', 'updated_at')

class VoteAdmin(admin.ModelAdmin):
    list_display = ('vote', 'voter_name', 'voter_email', 'project', 'payment_reference', 'vote_count', 'phone', 'created_at', 'updated_at')
    

class VotePaymentAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'vote', 'status', 'payment_method', 'transaction_id', 'paid_at', )
    search_fields = ('user',)
    list_filter = ('user',)


# class NotificationAdmin(admin.ModelAdmin):
#     list_display = ('user', 'teacher', 'order_item', 'seen', 'type', 'vote', 'date')


# class WishListAdmin(admin.ModelAdmin):
#     list_display = ('project', 'user')


admin.site.register(Project, ProjectAdmin)

admin.site.register(Category, CategoryAdmin)

admin.site.register(Vote, VoteAdmin)

admin.site.register(Commercial, CommercialAdmin)

admin.site.register(VotePriceSettings, VotePriceSettingsAdmin)

admin.site.register(VotePayment, VotePaymentAdmin)
