from django.shortcuts import render, redirect
from .models import User

def login_view(request):
    context = {
        'user' : User.objects.get(id=request.session['user_id'])
    }
    return render(request, 'loginandRegister/login_view.html', context)

def dashboard_view(request):
    context = {
        'user' : User.objects.get(id=request.session['user_id'])
    }
    return render(request, 'dashboard/dashboard_view.html', context)

def profile_view(request):
    context = {
        'user' : User.objects.get(id=request.session['user_id'])
    }
    return render(request, 'dashboard/profile_view.html', context)

def player_view(request):
    context = {
        'user' : User.objects.get(id=request.session['user_id'])
    }
    return render(request, 'dashboard/player_view.html', context)

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