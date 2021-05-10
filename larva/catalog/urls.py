from django.urls import path, include
from . import views

test_patterns = [
    path('', views.catalog, name='catalog'),
    path('reservations/', views.ReservationsView.as_view(), name='reservations'),
]
urlpatterns = [
    path('', include(test_patterns))
]