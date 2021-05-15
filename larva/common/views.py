from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.
def main(request):
    return render(request, 'common/index.html')

def health(request):
    message = "ok"
    result = {
        "message" : message
    }
    return JsonResponse(result)