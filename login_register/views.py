from django.shortcuts import render, redirect
from .models import User
import bcrypt

def login_view(request):
    return render(request, 'loginandRegister/login_view.html')

def rankings_view(request):
    user = User.objects.get(id = request.session['user_id'])
    context = {
    'user': user,
    }
    return render(request, 'dashboard/rankings_view.html', context)

def profile_view(request):
    user = User.objects.get(id = request.session['user_id'])
    context = {
    'user': user,
    }
    return render(request, 'dashboard/profile_view.html', context)

def player_view(request):
    user = User.objects.get(id = request.session['user_id'])
    context = {
    'user': user,
    }
    return render(request, 'dashboard/player_view.html', context)

def register(request):
    password = request.POST['password']
    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = User.objects.create(
        first_name = request.POST['first_name'],
        last_name = request.POST['last_name'],
        username = request.POST['username'],
        email = request.POST['email'],
        password = pw_hash
    )
    request.session['user_id'] = user.id
    return redirect('/game')

def login(request):
    if request.method == 'POST':
        email_id = request.POST['email']
        user = User.objects.filter(email=email_id)
        if len(user) > 0:
            user = user[0]
            if bcrypt.checkpw(request.POST['password'].encode(), user.password.encode()):
                request.session['user_id'] = user.id
                return redirect('/game')
    else:
        return redirect('/')

def logout(request):
    request.session.clear()
    return redirect('/')