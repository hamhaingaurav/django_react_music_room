from django.urls import path
from api.views import (
    RoomAPIView,
    CreateRoomAPIView,
    GetRoomAPIView,
    JoinRoomAPIView,
    CheckUserInRoomAPIView,
    LeaveRoomAPIView
)

urlpatterns = [
    path('rooms/', RoomAPIView.as_view(), name='room_api_view'),
    path(
        'rooms/create/',
        CreateRoomAPIView.as_view(),
        name='create_room_api_view'
    ),
    path('rooms/get/', GetRoomAPIView.as_view(), name='get_room_api_view'),
    path('rooms/join/', JoinRoomAPIView.as_view(), name='join_room_api_view'),
    path(
        'rooms/check_user_in_room/',
        CheckUserInRoomAPIView.as_view(),
        name='check_user_in_room_api_view'
    ),
    path('rooms/leave/', LeaveRoomAPIView.as_view(), name='leave_room_api_view'),
]
