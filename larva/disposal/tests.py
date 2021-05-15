from django.test import TestCase

# Create your tests here.

from common.models import User, Item, Charge, Reservation

import io
import json
import requests
from datetime import datetime
from pytz import timezone

import boto3
import base64
from PIL import Image
import os

class DisposalTest(TestCase):
    def get_standards(self):
        standard_list = Charge.objects.values('standard').filter(item__name='냉장고')
        print(standard_list)

# python manage.py test disposal.tests.Test.get_charge --testrunner='larva.test_runner.TestRunner'
class Test(TestCase):
    def get_charge(self):

        kst = datetime.now(timezone('Asia/Seoul'))
        date = str(kst.date())

        body = {'name': '김갑수', 
            'phone': '010-1111-1111', 
            'address': '강북구', 
            'disposal_date': '2021-05-14', 
            'contents': [{'img': 'ab,cd', 
                        'item_name': '침대', 
                        'charge_standard': '일반 침대', 
                        'reservation_count': '1', 
                        'total_price': '10000'}]}
        reservations = []
        name = body['name']
        phone = body['phone']
        address = body['address']
        disposal_date = body['disposal_date']
        contents = body['contents']
        reservation_date = date

        users = User.objects.all().filter(name=name, phone=phone)
        if len(users):
            user = users.first()
            if user.address != address:
                user.address = address
                user.save()
        else:
            user = User.objects.create(name=name, phone=phone, address=address)

        for content in contents:
            # img = content['img'].split(',')[-1]
            # img = base64.b64decode(img)
            # img = io.BytesIO(img)
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

        print(reservations)

        context = {
            'reservations' : reservations
        }
            


        # charge_item_id_list = []
        # reservations = []
        # for reservation in reservation_list:
        #     item__name = Item.objects.values('name').filter(id=reservation['charge__item_id'])
        #     reservation = dict(reservation)
        #     reservation['item__name'] = item__name[0]['name']
        #     reservations.append(reservation)
        # print(reservations)
