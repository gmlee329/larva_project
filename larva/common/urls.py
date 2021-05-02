from django.urls import path, include
import common.views

common_patterns = [
    path('', common.views.main, name='main'),
]
urlpatterns = [
    path('', include(common_patterns))
]