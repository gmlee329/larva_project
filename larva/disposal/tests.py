from django.test import TestCase

# Create your tests here.

from common.models import User, Item, Charge, Reservation

class DisposalTest(TestCase):
    def get_standards(self):
        standard_list = Charge.objects.values('standard').filter(item__name='냉장고')
        print(standard_list)