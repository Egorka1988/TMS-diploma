from django.shortcuts import render

def loginapp(request, *args, **kwargs):
    template = 'login_my.html'
    return render(
        request,
        template)
