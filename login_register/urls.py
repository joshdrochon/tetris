from django.urls import path
from .views import login_view, rankings_view, profile_view, player_view, register, login, logout,check_email_exist,login_check_ajax

urlpatterns = [
    path('', login_view),
    path('rankings', rankings_view),
    path('profile', profile_view),
    path('player', player_view),
    path('register', register),
    path('register/unique_email_check',check_email_exist),
    path('login/', login ),
    path('login/verify_ajax/',login_check_ajax),
    path('logout/', logout),
]