from django.urls import path
from userauths import views as UserViews
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    # Authentification Endpoints
    path('user/token/', UserViews.MyTokenObtainPairView.as_view()),
    path("user/token/refresh/", TokenRefreshView.as_view()),
    path("user/register/", UserViews.RegisterView.as_view()),
    path("user/password-reset/<email>/", UserViews.PasswordResetEmailVerifyAPIView.as_view()),
    path("user/password-change/", UserViews.PasswordChangeAPIView.as_view()),




    
]