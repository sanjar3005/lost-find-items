#url for api of login and registration
from django.urls import path
from .views import GoogleLoginView, LoginView, RegisterView
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),    

]