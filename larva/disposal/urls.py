from django.urls import path, include
from . import views

test_patterns = [
    path('', views.disposal, name='disposal'),
    path('prediction/', views.PredictView.as_view(), name='prediction'),
    path('price/', views.PriceView.as_view(), name='price'),
    path('standard/', views.StandardView.as_view(), name='standard'),
]
urlpatterns = [
    path('', include(test_patterns))
]