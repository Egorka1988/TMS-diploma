from django.urls import path

from sea_battle.views import handshake

urlpatterns = [
    path('', handshake, name='csrftoken_sending'),
]
