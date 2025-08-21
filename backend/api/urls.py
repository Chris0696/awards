from django.urls import path
from userauths import views as UserViews
from rest_framework_simplejwt.views import TokenRefreshView
from project import views as ProjectViews

urlpatterns = [
    # Authentification Endpoints
    path('user/login/', UserViews.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("user/token/refresh/", TokenRefreshView.as_view()),
    
    # Register Endpoints
    path("user/register/", UserViews.RegisterViewAPIView.as_view(), name='register'),
    path('admin/register/', UserViews.AdminRegisterViewAPIView.as_view(), name='admin_register'),
    
    path("user/password-reset/<email>/", UserViews.PasswordResetEmailVerifyAPIView.as_view(), name='password_reset_email'),
    path("user/password-change/", UserViews.PasswordChangeAPIView.as_view(), name='password_change'),

    # Project Endpoints
    path('projects/', ProjectViews.ProjectListCreateAPIView.as_view(), name='project_list_create'),
    path('projects/<str:project_id>/', ProjectViews.ProjectDetailAPIView.as_view(), name='project_detail'),
    path('projects/<str:project_id>/update/', ProjectViews.ProjectUpdateAPIView.as_view(), name='project_update'),
    path('projects/<str:project_id>/delete/', ProjectViews.ProjectDeleteAPIView.as_view(), name='project_delete'),
    
    # Commercials Endpoints
    path('user/commercials/', ProjectViews.CommercialListCreateView.as_view(), name='commercial_list_create'),
    path('user/commercials/<int:pk>/', ProjectViews.CommercialDetailView.as_view(), name='commercial_detail'),
    
    # Vote Endpoints
    path('votes/create/', ProjectViews.VoteCreateAPIView.as_view(), name='vote_create'),
    path('votes/', ProjectViews.VoteListAPIView.as_view(), name='vote_list'),
    path('votes/<int:id>/', ProjectViews.VoteDetailAPIView.as_view(), name='vote_detail'),
    
    path('vote-prices/', ProjectViews.VotePriceListAPIView.as_view(), name='vote_price_list_create'),
    path('vote-prices/<int:pk>/', ProjectViews.VotePriceDetailAPIView.as_view(), name='vote_price_detail'),
    
    # Payments Endpoints
    path('vote-payments/', ProjectViews.VotePaymentListAPIView.as_view(), name='vote_payment_list'),
    path('vote-payments/create/', ProjectViews.VotePaymentCreateAPIView.as_view(), name='vote_payment_create'),

]