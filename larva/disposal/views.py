from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, JsonResponse
from common.models import User, Item, Charge, Reservation
from disposal.im_utils import *

# Create your views here.
def disposal(request):
    return render(request, 'disposal/disposal.html')

class PredictView(View):
    def post(self, request):
        api_url = 'https://4rqor8vh30.execute-api.us-west-2.amazonaws.com/default/resnet-lambda'
        image = request.FILES.get('img')
        image_byte = image.read()
        img = Image.open(io.BytesIO(image_byte))
        img = img_to_npy(img)

        img = img.tolist()
        test_data = {
            'img' : img
        }
        payload = json.dumps(test_data)
        response = requests.post(url, data=payload)
        result = response.json()
        result = result['body']
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
    def img_to_npy(img):
        img = check_angle(img)
        img = make_square(img)
        img = img.convert('RGB')
        img = resize_img(img, shape=(100,100))
        img = np.array(img).reshape(1,100,100,3) / 255.
        return img

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

