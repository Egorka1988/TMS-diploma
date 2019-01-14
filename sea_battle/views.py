

import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views.generic import FormView, TemplateView
import online_users.models
from datetime import timedelta
from sea_battle.forms import GameAttrForm


class HelloView(TemplateView):

    template_name = 'index.html'

    def get(self, request, *args, **kwargs):

        template = HelloView.template_name

        return render(
            request,
            template)


class RegisterFormView(FormView):

    form_class = UserCreationForm
    template_name = 'signup.html'
    success_url = reverse_lazy('see_users')

    def form_valid(self, form):
        form.save()
        user = authenticate( # for redirecting after registration to success_url with ontime authentificate
            request=self.request,
            username=form.cleaned_data['username'],
            password=form.cleaned_data['password1']
        )
        login(self.request, user)
        return super(RegisterFormView, self).form_valid(form)


class SeeUsersView(FormView):

    template_name = 'playerlist.html'

    # your opponents in game.
    # You point the user that you want to create a game with
    # https://stackoverflow.com/questions/29663777/how-to-check-whether-a-user-is-online-in-django-template
    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        user_status = online_users.models.OnlineUserActivity.get_user_activities(timedelta(seconds=60))
        users = (user for user in user_status)
        return render(
            request,
            SeeUsersView.template_name,
            context={
                 "users": users,
            }
        )


class GameNewView(FormView):

    template_name = 'pre_battle.html'

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):

        size = int(request.POST.get('fld_size'))
        sizeiterator = list(range(size))
        opponent = request.POST.get('opponent_username')

        return render(
            request,
            GameNewView.template_name,
            context={
                'size': size,
                'sizeiterator': sizeiterator,
                'opponent': opponent,
            }
        )


class GamePlayView(FormView):

    template_name = 'battle.html'
    # https://www.findclip.net/video/oNhNzH8FCIM/7-uroki.html  form custom validation

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):

        if request.method == 'POST':
            form = GameAttrForm({
                'map_of_bf': request.POST.get('json_form')
            })

            if form.is_valid():

                print('form of ',request.user,' is ok')
                battlemap = form.save(commit=False)
                battlemap.user = request.user
                battlemap.save()

            else:

                print('form is invalid: ',form.errors)

            return render(
                request,
                GamePlayView.template_name,
                context={
                    'form': form,
                }
            )
