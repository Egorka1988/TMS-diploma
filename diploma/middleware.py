from django.utils.deprecation import MiddlewareMixin


class DebugMiddleware(MiddlewareMixin):

    def __call__(self, request):
        response = None
        if hasattr(self, 'process_request'):
            response = self.process_request(request)
        try:
            response = response or self.get_response(request)
        except Exception as e:
            print(f"********* {e}")
            raise
        if hasattr(self, 'process_response'):
            response = self.process_response(request, response)
        return response

    def process_request(self, request):
        # print(request)
        # print(dir(request))
        # print("**scheme", request.scheme)
        # print("**content_params", request.content_params)
        print("**body", request.body)
        # print("**POST", request.POST)
        # print("META", request.META)



        # return request