from django.urls import path
from userauths import views as UserViews
from rest_framework_simplejwt.views import TokenRefreshView
from project import views as ProjectViews

urlpatterns = [
    # Authentification Endpoints
    path('user/login/', UserViews.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("user/token/refresh/", TokenRefreshView.as_view()),
    
    path("user/register/", UserViews.RegisterView.as_view(), name='register'),
    path('admin/register/', UserViews.AdminRegisterView.as_view(), name='admin_register'),
    
    path("user/password-reset/<email>/", UserViews.PasswordResetEmailVerifyAPIView.as_view(), name='password_reset_email'),
    path("user/password-change/", UserViews.PasswordChangeAPIView.as_view(), name='password_change'),

    path('project/create/', ProjectViews.ProjectCreateView.as_view(), name='project_create'),
    path('vote/create/', ProjectViews.VoteCreateView.as_view(), name='vote_create'),
    
    path('user/commercials/', ProjectViews.CommercialListCreateView.as_view(), name='commercial_list_create'),
    path('user/commercials/<int:pk>/', ProjectViews.CommercialDetailView.as_view(), name='commercial_detail'),
    
    path('vote-prices/', ProjectViews.VotePriceListCreateView.as_view(), name='vote_price_list_create'),
    path('vote-prices/<int:pk>/', ProjectViews.VotePriceDetailView.as_view(), name='vote_price_detail'),
    path('vote-payments/', ProjectViews.VotePaymentListView.as_view(), name='vote_payment_list'),



]