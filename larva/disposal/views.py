from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, JsonResponse
from common.models import User, Item, Charge, Reservation

# Create your views here.
def disposal(request):
    return render(request, 'disposal/disposal.html')

class PredictView(View):
    def post(self, request):
        image = request.FILES.get('img')
        items = ['소파', '냉장고', '장롱', '책상']
        standard_list = Charge.objects.values('standard').filter(item__name=items[0])
        standards = []
        for standard in standard_list:
            standards.append(standard['standard'])
        result = {
            "item" : items,
            "standards" : standards
        }

        return JsonResponse(result)

class PriceView(View):
    def post(self, request):
        item = request.POST['item']
        standard = request.POST['standard']
        price_list = Charge.objects.values('price').filter(item__name=item, standard=standard)
        price = price_list[0]['price']
        result = {
            "price" : price
        }

        return JsonResponse(result)

class StandardView(View):
    def post(self, request):
        item = request.POST['item']
        standard_list = Charge.objects.values('standard').filter(item__name=item)
        standards = []
        for standard in standard_list:
            standards.append(standard['standard'])
        result = {
            "standards" : standards
        }

        return JsonResponse(result)

