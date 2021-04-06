from django.urls import path
from .views import login_view, dashboard_view, profile_view, player_view, login, register, logout

urlpatterns = [
    path('', login_view),
    path('dashboard/', dashboard_view),
    path('profile/', profile_view),
    path('player/', player_view),
    path('register/', register),
    path('login/', login ),
    path('logout/', logout),
]