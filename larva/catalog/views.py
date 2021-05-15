from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, JsonResponse
from django.urls import reverse
from common.models import User, Item, Charge, Reservation
import boto3
import base64

# Create your views here.
def catalog(request):
    return render(request, 'catalog/userInfo.html')

class ReservationsView(View):
    def post(self, request):
        name = str(request.POST['name'])
        phone = str(request.POST['phone'])
        bucket = 'larva-bucket'
        file_path = 'images/'
        s3 = boto3.client("s3")
        reservation_list = Reservation.objects.values('id', 'charge__item_id', 'charge__standard', 'charge__price', 'count', 'disposal_due_data', 'reservation_date').filter(user__name=name, user__phone=phone)
        reservations = []
        for reservation in reservation_list:
            item__name = Item.objects.values('name').filter(id=reservation['charge__item_id'])
            file_name = str(reservation['id'])
            file_name = file_path + file_name
            file_obj = s3.get_object(Bucket=bucket, Key=file_name) 
            file_content = file_obj["Body"].read()
            file_content = base64.b64encode(file_content).decode('utf-8')
            reservation = dict(reservation)
            reservation['total_price'] = reservation['charge__price'] * reservation['count']
            reservation['disposal_due_data'] = reservation['disposal_due_data'].isoformat()
            reservation['reservation_date'] = reservation['reservation_date'].isoformat()
            reservation['item__name'] = item__name[0]['name']
            reservation['item__img'] = file_content
            reservations.append(reservation)
        
        context = {
            'reservations' : reservations
        }

        return render(request, 'catalog/list.html', context=context)