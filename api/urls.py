from django.urls import path
from api.views import (
    RoomAPIView,
    CreateRoomAPIView,
    UpdateRoomAPIView,
    GetRoomAPIView,
    JoinRoomAPIView,
    CheckUserInRoomAPIView,
    LeaveRoomAPIView
)

urlpatterns = [
    path(
        'rooms/',
        RoomAPIView.as_view(),
        name='room_api_view'
    ),
    path(
        'room/create/',
        CreateRoomAPIView.as_view(),
        name='create_room_api_view'
    ),
    path(
        'room/update/',
        UpdateRoomAPIView.as_view(),
        name='update_room_api_view'
    ),
    path(
        'room/get/',
        GetRoomAPIView.as_view(),
        name='get_room_api_view'
    ),
    path(
        'room/join/',
        JoinRoomAPIView.as_view(),
        name='join_room_api_view'
    ),
    path(
        'room/check_user_in_room/',
        CheckUserInRoomAPIView.as_view(),
        name='check_user_in_room_api_view'
    ),
    path(
        'room/leave/',
        LeaveRoomAPIView.as_view(),
        name='leave_room_api_view'
    ),
]
