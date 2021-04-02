from django.shortcuts import render

def login_view(request):
    return render(request, 'loginandRegister/login_view.html')

def dashboard_view(request):
    return render(request, 'dashboard/dashboard_view.html')

def profile_view(request):
    return render(request, 'dashboard/profile_view.html')

def player_view(request):
    return render(request, 'dashboard/player_view.html')