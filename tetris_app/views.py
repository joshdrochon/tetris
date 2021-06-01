from django.shortcuts import render
from login_register.models import User
from .decorators import authenticate_user

@authenticate_user
def game_view(request):
    [user] = User.objects.filter(id = request.session['user_id'])
    context = {
        'user': user,
    }
    return render(request,'tetrisgame/game_view.html', context)

