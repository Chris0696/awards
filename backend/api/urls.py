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


urlpatterns = [
    # Authentification Endpoints
    path('auth/login/', UserViews.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/logout/', UserViews.LogoutView.as_view(), name='logout'),
    path("auth/token/refresh/", TokenRefreshView.as_view()),
    
    # Register Endpoints
    path("auth/register/authorproject", UserViews.RegisterViewAPIView.as_view(), name='register'),
    path('auth/admin/register/commercial', UserViews.AdminRegisterViewAPIView.as_view(), name='admin_register'),
    
    path("auth/password-reset/<email>/", UserViews.PasswordResetEmailVerifyAPIView.as_view(), name='password_reset_email'),
    path("auth/password-change/", UserViews.PasswordChangeAPIView.as_view(), name='password_change'),
    path('auth/globalprofile/<user_id>/', UserViews.ProfileAPIView.as_view(), name='profile'),

    path('auth/profile/<int:user_id>/', ApiViews.UserProfileAPIView.as_view(), name='user_profile'),


    # Project Endpoints
    path('projects/', ProjectViews.ProjectListCreateAPIView.as_view(), name='project_list_create'),
    path('projects/<str:project_id>/', ProjectViews.ProjectDetailAPIView.as_view(), name='project_detail'),
    path('projects/<str:project_id>/update/', ProjectViews.ProjectUpdateAPIView.as_view(), name='project_update'),
    path('projects/<str:project_id>/delete/', ProjectViews.ProjectDeleteAPIView.as_view(), name='project_delete'),
    
    # CATEGORIES Endpoints
    # Endpoint public pour lister les catégories actives
    path('categories/', ProjectViews.ActiveCategoryListView.as_view(), name='active_categories'),
    # path('categories/<int:pk>/', ProjectViews.CategoryDetailAPIView.as_view(), name='category_detail'),
    # path('admin/categories/', ProjectViews.CategoryAdminViewSet.as_view(), name='admin_category'),
    path('', include(router.urls)),
    
    # path('categories/debug/', ProjectViews.CategoryListView.as_view(), name='categories-debug')
    
    # Commercials Endpoints
    # path('user/commercials/', CommercialViews.CommercialListCreateView.as_view(), name='commercial_list_create'),
    path('user/commercials/<int:pk>/', CommercialViews.CommercialDetailView.as_view(), name='commercial_detail'),
    
     # === STATISTIQUES ===
    path('stats/general/', ApiViews.general_stats_api, name='general_stats'),
    
    
    # === DASHBOARDS ===
    path('dashboard/admin/', ApiViews.AdminDashboardAPIView.as_view(), name='admin_dashboard'),
    path('dashboard/owner/', ApiViews.OwnerDashboardAPIView.as_view(), name='owner_dashboard'),
    path('dashboard/commercial/', ApiViews.CommercialDashboardAPIView.as_view(), name='commercial_dashboard'),
    
    
    # Vote Endpoints
    
    path('votes/', ProjectViews.VoteListAPIView.as_view(), name='vote_list'),
    path('votes/create/', ProjectViews.VoteCreateAPIView.as_view(), name='vote_create'),
    path('votes/<int:id>/', ProjectViews.VoteDetailAPIView.as_view(), name='vote_detail'),
    
    path('vote-prices/', ProjectViews.VotePriceListAPIView.as_view(), name='vote_price_list_create'),
    path('vote-prices/<int:pk>/', ProjectViews.VotePriceDetailAPIView.as_view(), name='vote_price_detail'),
    
    # Payments Endpoints
    path('vote-payments/', ProjectViews.VotePaymentListAPIView.as_view(), name='vote_payment_list'),
    path('vote-payments/create/', ProjectViews.VotePaymentCreateAPIView.as_view(), name='vote_payment_create'),

]