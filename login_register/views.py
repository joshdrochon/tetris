from django.shortcuts import render, redirect
from .models import User

def login_view(request):
    return render(request, 'loginandRegister/login_view.html')

def rankings_view(request):
    return render(request, 'dashboard/rankings_view.html')

def profile_view(request):
    return render(request, 'dashboard/profile_view.html')

def player_view(request):
    return render(request, 'dashboard/player_view.html')

def register(request):
    new_user = User.objects.register(request.POST)
    request.session['user_id'] = new_user.id
    return redirect('/dashboard')

def login(request):
    user = User.objects.filter(email=request.POST['email'], password=request.POST['password'])
    if len(user) > 0: 
        user = user[0] 
        request.session['user_id'] = user.id
        return redirect('/dashboard')
    else:
        return redirect('/')

def logout(request):
    request.session.clear()
    return redirect('/')