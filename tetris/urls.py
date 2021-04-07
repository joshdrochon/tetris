from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.staticfiles.urls import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('login_register.urls')),
    path('dashboard/', include('login_register.urls')),
    path('game', include('tetris_app.urls')),
    path('profile/', include('login_register.urls')),
    path('player/', include('login_register.urls')),

]

urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

