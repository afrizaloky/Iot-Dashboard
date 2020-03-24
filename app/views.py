from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect
from django.template import loader
from django.http import HttpResponse

from django.views.generic.base import TemplateView, View
from rest_framework import status
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Sensor
from .models import Slider
from .serializers import SliderSerializer
from .serializers import SensorSerializer
import json
from rest_framework.decorators import api_view
from django.core import serializers
from django.http import JsonResponse

# @login_required(login_url="/login/")


def index(request):
    return render(request, "index.html")

# @login_required(login_url="/login/")


def pages(request):
    context = {}
    # All resource paths end in .html.
    # Pick out the html file name from the url. And load that template.
    try:

        load_template = request.path.split('/')[-1]
        template = loader.get_template('pages/' + load_template)
        print(load_template)
        if(load_template == "sensors.html"):
            print("sensors pages")
            # all_sensors = Sensor.objects.all()
            # total_data = len(all_sensors)
            last_ten = Sensor.objects.all().order_by('-id')[:10]
            all_sensors = reversed(last_ten)
            context = {"all_sensors": all_sensors}

        return HttpResponse(template.render(context, request))

    except:

        template = loader.get_template('pages/error-404.html')
        return HttpResponse(template.render(context, request))


def getData(request):
    json_serializer = serializers.get_serializer("json")()
    data_sensor = json_serializer.serialize(Sensor.objects.all())
    data_sensor = json.loads(data_sensor)
    # print(len(data_sensor))
    return JsonResponse(data_sensor, safe=False)


def getSlider(request):
    json_serializer = serializers.get_serializer("json")()
    data_sensor = json_serializer.serialize(Slider.objects.all())
    data_sensor = json.loads(data_sensor)
    data_sensor = data_sensor[-10:]
    return JsonResponse(data_sensor, safe=False)

# class ListSensorView(TemplateView):
#     # template_name = 'pages/sensors.html'

#     def get_context_data(self, **kwargs):
#         context_data = super(ListSensorView, self).get_context_data(**kwargs)
#         all_sensors = Sensor.objects.all()
#         context_data['all_sensors'] = all_sensors

#         return context_data


api_key = "yourpassword"


class APISensorView(APIView):
    def get(self, request):
        all_sensors = Sensor.objects.all()
        serializer = SensorSerializer(all_sensors, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        if request.data['api_key'] == api_key:
            del request.data['api_key']
            serializer = SensorSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class APISliderView(APIView):
    def get(self, request):
        Sliders = Slider.objects.all()
        serializer = SliderSerializer(Sliders, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = SliderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SliderDetail(APIView):
    """
    Retrieve, update or delete a slider instance.
    """

    def get_object(self, pk):
        try:
            return Slider.objects.get(pk=pk)
        except Slider.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        slider = self.get_object(pk)
        serializer = SliderSerializer(slider)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        slider = self.get_object(pk)
        serializer = SliderSerializer(slider, data=request.data)
        print(request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        slider = self.get_object(pk)
        slider.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
