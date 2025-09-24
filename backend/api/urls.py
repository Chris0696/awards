from django.urls import path, include
from userauths import views as UserViews
from rest_framework_simplejwt.views import TokenRefreshView
from project import views as ProjectViews

from commercial import views as CommercialViews
from api import views as ApiViews
from projectowner import views as OwnerViews
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'admin/categories', ProjectViews.CategoryAdminViewSet, basename='admin-categories')
router.register(r'admin/projects', ProjectViews.ProjectAdminViewSet, basename='admin-projects')
# router.register(r'admin/users', CommercialViews.AdminCommercialViewSet, basename='admin-users')


urlpatterns = [
    # Authentification Endpoints
    path('auth/login/', UserViews.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/logout/', UserViews.LogoutView.as_view(), name='logout'),
    path('auth/refresh/', UserViews.CustomTokenRefreshView.as_view(), name='token_refresh'),
    
    # Register Endpoints
    path("auth/register/authorproject", UserViews.RegisterViewAPIView.as_view(), name='register'),
    # path('auth/admin/register/commercial', UserViews.AdminRegisterViewAPIView.as_view(), name='admin_register'),
    
    path("auth/password-reset/<email>/", UserViews.PasswordResetEmailVerifyAPIView.as_view(), name='password_reset_email'),
    path("auth/password-change/", UserViews.PasswordChangeAPIView.as_view(), name='password_change'),
    path('auth/globalprofile/<user_id>/', UserViews.ProfileAPIView.as_view(), name='profile'),

    path('auth/profile/<int:user_id>/', ApiViews.UserProfileAPIView.as_view(), name='user_profile'),


    
    path('owner/profile/update/<int:user_id>/', OwnerViews.UpdateOwnerProfileAPIView.as_view(), name='update-owner-profile'),

    # ProjectOwner Endpoints
    
    path('admin/owners/', OwnerViews.OwnerListCreateAPIView.as_view(), name='admin-owner-list-create'),
    
    # Détail d'un Owner spécifique
    path('admin/owners/<int:id>/', OwnerViews.OwnerDetailAPIView.as_view(), name='admin-owner-detail'),
    
    # Mise à jour d'un Owner
    path('admin/owners/<int:id>/update/', OwnerViews.OwnerUpdateAPIView.as_view(), name='admin-owner-update'),
    
    # Suppression d'un Owner
    path('admin/owners/<int:id>/delete/', OwnerViews.OwnerDeleteAPIView.as_view(), name='admin-owner-delete'),
    
    # Activer/Désactiver un Owner
    path('admin/owners/<int:id>/toggle-active/', OwnerViews.OwnerToggleActiveAPIView.as_view(), name='admin-owner-toggle-active'),
    
    # Statistiques des Owner
    path('admin/owners/statistics/', OwnerViews.OwnerStatisticsAPIView.as_view(), name='admin-owner-statistics'),
    
    # Project Endpoints
    path('projects/', ProjectViews.ProjectListCreateAPIView.as_view(), name='project_list_create'),
    path('projects/<str:project_id>/', ProjectViews.ProjectDetailAPIView.as_view(), name='project_detail'),
    path('projects/<str:project_id>/update/', ProjectViews.ProjectUpdateAPIView.as_view(), name='project_update'),
    path('projects/<str:project_id>/delete/', ProjectViews.ProjectDeleteAPIView.as_view(), name='project_delete'),
    
    # Liste publique des projets
    path('public/projects/', ProjectViews.PublicProjectListAPIView.as_view(), name='public-projects'),
    
    # Détail d'un projet par slug
    path('public/projects/<slug:slug>/', ProjectViews.PublicProjectDetailAPIView.as_view(), name='public-project-detail'),
    
    # Statistiques publiques
    path('public/projects-stats/', ProjectViews.public_projects_stats, name='public-projects-stats'),
    
    # Projets spéciaux
    path('public/projects/featured/', ProjectViews.featured_projects, name='featured-projects'),
    path('public/projects/trending/', ProjectViews.trending_projects, name='trending-projects'),
    
    # Analytics
    path('projects/<str:project_id>/analytics/', ApiViews.project_analytics, name='project-analytics'),
    
    # CATEGORIES Endpoints
    # Endpoint public pour lister les catégories actives
    path('categories/', ProjectViews.ActiveCategoryListView.as_view(), name='active_categories'),
    # path('categories/<int:pk>/', ProjectViews.CategoryDetailAPIView.as_view(), name='category_detail'),
    # path('admin/categories/', ProjectViews.CategoryAdminViewSet.as_view(), name='admin_category'),
    path('', include(router.urls)),
    
    # path('categories/debug/', ProjectViews.CategoryListView.as_view(), name='categories-debug')
    
    # Commercials Endpoints
    # path('user/commercials/', CommercialViews.CommercialListCreateView.as_view(), name='commercial_list_create'),
    # path('user/commercials/<int:pk>/', CommercialViews.CommercialDetailView.as_view(), name='commercial_detail'),
    
    path('admin/users/commercial/', CommercialViews.AdminCommercialView.as_view(), name='admin-commercial-list-create'),
    path('admin/users/commercial/<int:pk>/', CommercialViews.AdminCommercialView.as_view(), name='admin-commercial-detail'),
    
     # === STATISTIQUES ===
    path('stats/general/', ApiViews.general_stats_api, name='general_stats'),
    
    
    # === DASHBOARDS ===
    path('dashboard/admin/', ApiViews.AdminDashboardAPIView.as_view(), name='admin_dashboard'),
    path('dashboard/owner/', ApiViews.OwnerDashboardAPIView.as_view(), name='owner_dashboard'),
    path('dashboard/commercial/', ApiViews.CommercialDashboardAPIView.as_view(), name='commercial_dashboard'),
    
    
    # Vote Endpoints
    
    # path('votes/', ProjectViews.VoteListAPIView.as_view(), name='vote_list'),
    # path('votes/create/', ProjectViews.VoteCreateAPIView.as_view(), name='vote_create'),
    # path('votes/<int:id>/', ProjectViews.VoteDetailAPIView.as_view(), name='vote_detail'),
    # path('votes/vote-and-pay/', ProjectViews.VoteAndPayAPIView.as_view(), name='vote_and_pay'),
    
    
    # path('votes/vote-prices/', ProjectViews.VotePriceListAPIView.as_view(), name='vote_price_list'),
    # path('votes/vote-prices/<int:pk>/', ProjectViews.VotePriceDetailAPIView.as_view(), name='vote_price_detail'),
    
    # Payments Endpoints
    # path('votes/vote-payments/', ProjectViews.VotePaymentListAPIView.as_view(), name='vote_payment_list'),
    # path('vote-payments/create/', ProjectViews.VotePaymentCreateAPIView.as_view(), name='vote_payment_create'),
    
    
    # Route principale pour créer un vote et le payer
    path('votes/create-and-pay/', ProjectViews.VoteAndPaymentCreateAPIView.as_view(), name='vote-create-and-pay'),
    
    # Routes utilitaires
    path('votes/price/', ProjectViews.get_vote_price, name='vote-price'),
    path('votes/calculate-cost/', ProjectViews.calculate_vote_cost, name='calculate-vote-cost'),
    
    # Configuration admin
    path('admin/voteprice/', ProjectViews.VotePriceSettingsAPIView.as_view(), name='voteprice-settings'),
    
    

]