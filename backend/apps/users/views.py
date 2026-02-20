from os import getenv
import requests
from dotenv import load_dotenv
load_dotenv()
from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
from django.utils.crypto import get_random_string
from .models import User
from .serializers import RegisterSerializer, GoogleSocialAuthSerializer

# Create your views here.
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]  # Allow anyone to register

    def create(self,request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'user': {
                    'user_id': str(user.id),
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_verified': user.is_verified,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }
        )
    

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = GoogleSocialAuthSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['auth_token']

        try:
            # 1. Verify the token with Google
            # CLIENT_ID should be in your settings.py/environment variables
            google_response = requests.get(f'https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}')

            if google_response.status_code != 200:
                return Response({"error": "Invalid Google token"}, status=400)

            id_info = google_response.json()

            # 2. Get user info from the verified token
            email = id_info['email']
            first_name = id_info.get('given_name', '')
            last_name = id_info.get('family_name', '')

            # 3. Check if user exists (Login vs Register)
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_verified': True, # Google verified this email for us!
                    'password': get_random_string(length=32) # Set a random password
                }
            )

            if not user.is_verified:
                user.is_verified = True
                user.save()

            # 4. Generate JWT Tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_verified': user.is_verified
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)

        except ValueError:
            # Token is invalid or expired
            return Response(
                {'error': 'Invalid Google token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )