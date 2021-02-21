from django.urls import path, re_path
from spotify.views import (
    SpotifyAuthURLAPIView,
    SpotifyCallbackAPIView,
    IsAuthenticatedAPIView,
)

urlpatterns = [
    path('get-auth-url/', SpotifyAuthURLAPIView.as_view()),
    path('callback/', SpotifyCallbackAPIView.as_view()),
    path('is-authenticated/', IsAuthenticatedAPIView.as_view()),
]
