from django.urls import path
from .views import login_view, rankings_view, profile_view, player_view

urlpatterns = [
    path('', login_view),
    path('rankings/', rankings_view),
    path('profile/', profile_view),
    path('player/', player_view),
]