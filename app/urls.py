from django.conf.urls import url
from django.urls import path, re_path
from app import views
from .views import APISensorView
from .views import APISliderView
urlpatterns = [
    # Matches any html file - to be used for gentella
    # Avoid using your .html in your resources.
    # Or create a separate django app.
    re_path(r'^.*\.html', views.pages, name='pages'),

    # The home page
    path('', views.index, name='home'),
    # url(r'^sensors/$', ListSensorView.as_view(), name='ListSensorView'),
    url(r'^api/$', APISensorView.as_view(), name='APISensorView'),
    url(r'^Slider/$', APISliderView.as_view(), name='APISliderView'),
    url(r'^getData/$', views.getData, name='getData'),
    url(r'^getSlider/$', views.getSlider, name='getSlider'),

    path('slider_detail/', views.SliderDetail.as_view()),
    path('slider_detail/<int:pk>/', views.SliderDetail.as_view()),
    # url(r'^get/$'),
]
