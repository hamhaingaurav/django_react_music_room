from django.urls import path, re_path
from frontend.views import index

urlpatterns = [
    path('', index),
    path('join/', index),
    path('create/', index),
    path('room/<str:roomCode>/', index),
]
