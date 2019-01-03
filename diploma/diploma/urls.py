"""diploma URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from django.contrib import auth as auth_views
from sea_battle.views import index, see_users, RegisterFormView, game_new, gameplay


urlpatterns = [
    path('', index, name='index'),
    path('admin/', admin.site.urls),
    path('auth/', include('login_app.urls')),
    path('accounts/logged_in/', see_users, name='users_list'),
    path('accounts/', include('django.contrib.auth.urls'), name='login_page'),
    # path('', include('sea_battle.urls')),
    path('accounts/signup/', RegisterFormView.as_view()),
    path('game_create/', game_new, name='game_new'),
    path('game/', gameplay, name='gameplay')
]
