from django.shortcuts import render

def login_view(request):
    return render(request, 'loginandRegister/login_view.html')

def register_view(request):
    return render(request, 'loginandRegister/register_view.html')
