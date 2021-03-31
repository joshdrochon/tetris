from django.urls import path
from .views import login_view, register_view

urlpatterns = [
    path('login', login_view),
    path('register', register_view),
]