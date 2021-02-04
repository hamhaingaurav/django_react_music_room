from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from api.models import Room
from api.serializers import RoomSerializer, CreateRoomSerializer

# Create your views here.


class RoomAPIView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoomAPIView(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = self.serializer_class(room[0]).data
                data['is_host'] = (
                    self.request.session.session_key == room[0].host)
                return Response(
                    data,
                    status=status.HTTP_200_OK
                )

            return Response(
                {'error': 'Invalid Code'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {'error': 'Bad Request, did not get the value of code'},
            status=status.HTTP_400_BAD_REQUEST
        )


class CreateRoomAPIView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key

            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            else:
                room = Room.objects.create(
                    host=host,
                    guest_can_pause=guest_can_pause,
                    votes_to_skip=votes_to_skip
                )
            self.request.session['room_code'] = room.code
            return Response(
                RoomSerializer(room).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            {'error': 'Bad Request, Invalid values'},
            status=status.HTTP_400_BAD_REQUEST
        )


class JoinRoomAPIView(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)

        if code != None:
            rooms = Room.objects.filter(code=code)
            if len(rooms) > 0:
                room = rooms[0]
                self.request.session['room_code'] = code
                return Response(
                    {'message': 'Room Joined!'},
                    status=status.HTTP_200_OK
                )

            return Response(
                {'error': 'Invalid room code'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {'error': 'Bad Request, did not get the value of code'},
            status=status.HTTP_400_BAD_REQUEST
        )


class CheckUserInRoomAPIView(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'code': self.request.session.get('room_code')
        }

        return Response(
            data,
            status=status.HTTP_200_OK
        )


class LeaveRoomAPIView(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            code = self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            rooms = Room.objects.filter(host=host_id)
            if len(rooms) > 0:
                room = rooms[0]
                room.delete()

        return Response(
            {'message': 'Leaved'},
            status=status.HTTP_200_OK
        )
