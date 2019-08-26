from django.http import HttpResponse

from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def handshake(request):

    if request.method == "GET":
        response = HttpResponse("csrftoken recieved")
        return response
