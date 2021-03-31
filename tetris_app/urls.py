from django.urls import path
from .views import game_view

urlpatterns = [
    path('', game_view),
]