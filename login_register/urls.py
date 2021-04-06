from django.urls import path
<<<<<<< HEAD
from .views import login_view, dashboard_view, profile_view, player_view, login, register, logout
=======
from .views import login_view, rankings_view, profile_view, player_view
>>>>>>> new__dev

urlpatterns = [
    path('', login_view),
    path('rankings/', rankings_view),
    path('profile/', profile_view),
    path('player/', player_view),
    path('register/', register),
    path('login/', login ),
    path('logout/', logout),
]