from django.test import TestCase

# Create your tests here.

from common.models import User, Item, Charge, Reservation

class DisposalTest(TestCase):
    def get_standards(self):
        standard_list = Charge.objects.values('standard').filter(item__name='냉장고')
        print(standard_list)

# python manage.py test disposal.tests.Test.get_charge --testrunner='larva.test_runner.TestRunner'
class Test(TestCase):
    def get_charge(self):
        reservation_list = Reservation.objects.values('id', 'charge__item_id', 'charge__standard', 'charge__price', 'count', 'disposal_due_data', 'reservation_date').filter(user__name='박수호', user__phone='010-1111-1111')
        charge_item_id_list = []
        reservations = []
        for reservation in reservation_list:
            item__name = Item.objects.values('name').filter(id=reservation['charge__item_id'])
            reservation = dict(reservation)
            reservation['item__name'] = item__name[0]['name']
            reservations.append(reservation)
        print(reservations)
