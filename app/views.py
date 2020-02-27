from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect
from django.template import loader
from django.http import HttpResponse

from django.views.generic.base import TemplateView, View
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Sensor
from .serializers import SensorSerializer

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
        if(load_template == "sensors.html"):
            all_sensors = Sensor.objects.all()
            context = {"all_sensors": all_sensors}

            # return render(request, "pages/sensors.html", {"all_sensors": all_sensors})

        return HttpResponse(template.render(context, request))

    except:

        template = loader.get_template('pages/error-404.html')
        return HttpResponse(template.render(context, request))


class ListSensorView(TemplateView):
    # template_name = 'pages/sensors.html'

    def get_context_data(self, **kwargs):
        context_data = super(ListSensorView, self).get_context_data(**kwargs)
        all_sensors = Sensor.objects.all()
        context_data['all_sensors'] = all_sensors

        return context_data


class APISensorView(APIView):
    def get(self, request):
        all_sensors = Sensor.objects.all()
        serializer = SensorSerializer(all_sensors, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = SensorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
