from django.conf.urls import url
from django.urls import path, re_path
from app import views
from .views import ListSensorView, APISensorView
urlpatterns = [
    # Matches any html file - to be used for gentella
    # Avoid using your .html in your resources.
    # Or create a separate django app.
    re_path(r'^.*\.html', views.pages, name='pages'),

    # The home page
    path('', views.index, name='home'),
    # url(r'^sensors/$', ListSensorView.as_view(), name='ListSensorView'),
    url(r'^api/$', APISensorView.as_view(), name='APISensorView'),
    # url(r'^get/$'),
]
