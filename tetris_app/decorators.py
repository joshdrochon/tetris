from django.shortcuts import redirect
from functools import wraps

def authenticate_user(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        if not 'user_id' in request.session:
            return redirect("/")
        return func(request)
    return wrapper