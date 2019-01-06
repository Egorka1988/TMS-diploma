from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.generic import FormView, TemplateView
import online_users.models
from datetime import timedelta

class HelloView(TemplateView):

    def index(request, *args, **kwargs):
        template = 'index.html'
        return render(
            request,
            template)

class RegisterFormView(FormView):

    form_class = UserCreationForm
    success_url = '../login/' #не знаю, как реализовать более изящно. reverse and redirect не помогли
    template_name = "registration/signup.html"

    def form_valid(self, form):
        form.save()
        return super(RegisterFormView, self).form_valid(form)

@login_required
class GameView(TemplateView):

    #your opponents in game. You point the user that you want to create a game with
    #https://stackoverflow.com/questions/29663777/how-to-check-whether-a-user-is-online-in-django-template
    def see_users(request, *args,**kwargs):
        user_status = online_users.models.OnlineUserActivity.get_user_activities(timedelta(seconds=60))
        users = (user for user in user_status)
        return render(
            request,
            template_name='playerlist.html',
            context={
                 "users": users,
            }
        )

    def game_new(request, *args, **kwargs):
        size = int(request.POST.get('fld_size'))
        sizeiterator = list(range(size))
        opponent = request.POST.get('opponent_username')
        return render(
            request,
            'sea_battle/pre_battle.html',
            {'size': size,
             'sizeiterator': sizeiterator,
             'opponent': opponent}
        )

    def gameplay(request, *args, **kwargs):
        print(request.POST)
        size = request.POST.get('data')
        print(size)
        sizeiterator = list(range(int(size)))
        json_place = request.POST.get('json_place')
        return render(
            request,
            'sea_battle/battle.html',
            {'sizeiterator': sizeiterator,
             'json_place': json_place}
        )
