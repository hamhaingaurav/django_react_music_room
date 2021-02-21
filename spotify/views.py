from django.shortcuts import render, redirect

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from requests import Request, post

from spotify.credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from spotify.utils import update_or_create_user_tokens, is_spotify_authenticated
# Create your views here.


class SpotifyAuthURLAPIView(APIView):
    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request(
            'GET',
            'https://accounts.spotify.com/authorize',
            params={
                'scopes': scopes,
                'response_type': 'code',
                'redirect_uri': REDIRECT_URI,
                'client_id': CLIENT_ID
            }
        ).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


class SpotifyCallbackAPIView(APIView):
    def get(self, request, format=None):
        code = request.GET.get('code')
        error = request.GET.get('error')

        response = post(
            'https://accounts.spotify.com/api/token',
            data={
                'grant-type': 'authorization_code',
                'code': code,
                'redirect_uri': REDIRECT_URI,
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
            }
        ).json()

        access_token = response.get('access_token')
        token_type = response.get('token_type')
        refresh_token = response.get('refresh_token')
        expires_in = response.get('expires_in')
        error = response.get('error')

        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        update_or_create_user_tokens(
            self.request.session.session_key, access_token, token_type, expires_in, refresh_token
        )

        return redirect('frontend:')


class IsAuthenticatedAPIView(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key
        )

        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)
