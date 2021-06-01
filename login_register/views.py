from django.shortcuts import render, redirect
from .models import User
import bcrypt
from django.http.response import HttpResponse
from django.http import JsonResponse
from django.contrib import messages
from functools import wraps

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
    if request.method=="POST":
        print("I am Here to register !")
        errors=User.objects.reg_validate(request.POST)
        if len(errors)>0:
            print("Looks like i have errors!")
            for key ,val in errors.items():
                messages.error(request,val)
            return redirect("/")
        else:
            print("all set to create user record")
            password = request.POST['password']
            pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()) #.decode()
            user = User.objects.create(
                first_name = request.POST['first_name'],
                last_name = request.POST['last_name'],
                username = request.POST['username'],
                email = request.POST['email'],
                password = pw_hash
            )
            request.session['user_id'] = user.id
            return redirect('/game')

def check_email_exist(request):
    if request.is_ajax and request.method=="POST":
        print("I am here")
        verify_email=User.objects.filter(email=request.POST.get('email_reg'))
        print(verify_email)
        if verify_email:
            this_email=verify_email[0]
            duplicate= f"{this_email.email} already registered"
            print(duplicate)
            return JsonResponse(duplicate,safe=False)
        unique="This email is valid to register"
        return JsonResponse(unique,safe=False)

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

def login_check_ajax(request):
    if request.is_ajax and request.method=="POST":
        print("I am in login_check_ajax")
        print(request.POST.get('email'))
        get_user=User.objects.filter(email=request.POST.get('email'))
        print(get_user)
        if get_user:
            this_user=get_user[0]
            if bcrypt.checkpw(request.POST.get('password').encode(),this_user.password.encode()):
                request.session['user_id']=this_user.id
                return JsonResponse('success',safe=False)
        data="Incorrect Email Address and/or Password"
        return JsonResponse(data,safe=False)

def logout(request):
    request.session.clear()
    return redirect('/')