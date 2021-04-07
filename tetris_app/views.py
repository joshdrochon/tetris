from django.shortcuts import render
from login_register.models import User

def game_view(request):
    user = User.objects.get(id = request.session['user_id'])
    context = {
    'user': user,
}
    return render(request,'tetrisgame/game_view.html', context)

