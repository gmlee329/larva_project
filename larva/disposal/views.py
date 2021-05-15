from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, JsonResponse
from common.models import User, Item, Charge, Reservation
from disposal.im_utils import *
import io
import json
import requests
from datetime import datetime
from pytz import timezone

import boto3
import base64
from PIL import Image
import os


# Create your views here.
def disposal(request):
    return render(request, 'disposal/disposal.html')

class PredictView(View):
    def post(self, request):
        api_url = 'https://4rqor8vh30.execute-api.us-west-2.amazonaws.com/default/resnet-lambda'
        image = request.FILES.get('img')
        image_byte = image.read()
        img = Image.open(io.BytesIO(image_byte))
        img = self.img_to_npy(img)

        img = img.tolist()
        test_data = {
            'img' : img
        }
        payload = json.dumps(test_data)
        response = requests.post(api_url, data=payload)
        result = response.json()
        result = result['body']
        items = result['category']
        selected_standard = result['standard']
        standard_list = Charge.objects.values('standard').filter(item__name=items[0][0])
        standards = []
        for standard in standard_list:
            standards.append(standard['standard'])
            if standard['standard'] == '단일':
                selected_standard = '단일'
        result = {
            "item" : items,
            "standards" : standards,
            "selected_standard" : selected_standard
        }

        return JsonResponse(result)
        
    def img_to_npy(self, img):
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

class RegistrationView(View):
    def post(self, request):
        s3 = boto3.client("s3")
        bucket = 'larva-bucket'
        file_path = 'images/'

        kst = datetime.now(timezone('Asia/Seoul'))
        date = str(kst.date())

        reservations = []
        body = json.loads(request.body.decode())
        name = body['name']
        phone = body['phone']
        address = body['address']
        disposal_date = body['disposal_date']
        reservation_date = date
        contents = body['contents']
        
        users = User.objects.all().filter(name=name, phone=phone)
        if len(users):
            user = users.first()
            if user.address != address:
                user.address = address
                user.save()
        else:
            user = User.objects.create(name=name, phone=phone, address=address)

        for content in contents:
            img = content['img'].split(',')[-1]
            img = base64.b64decode(img)
            img = io.BytesIO(img)

            item_name = content['item_name']
            charge_standard = content['charge_standard']
            charges = Charge.objects.all().filter(item__name=item_name, standard=charge_standard)
            charge = charges.first()

            reservation_count = int(content['reservation_count'])
            reservation_obj = Reservation.objects.create(user=user, charge=charge, count=reservation_count, disposal_due_data=disposal_date, reservation_date=reservation_date)
            
            reservation = dict()
            reservation['id'] = reservation_obj.id
            reservation['item'] = item_name
            reservation['standard'] = charge_standard
            reservation['count'] = reservation_count
            reservation['price'] = content['total_price']
            reservations.append(reservation)

            file_name = str(reservation['id'])
            s3.put_object(Bucket=bucket, Body = img, Key=file_path + file_name)
        
        context = {
            'reservations' : reservations
        }

        return render(request, 'disposal/resceipt.html', context=context)

